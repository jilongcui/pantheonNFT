// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "@nomiclabs/buidler/console.sol";
import "./utils/math/SafeMath.sol";
import "./utils/Address.sol";
import "./access/Ownable.sol";
import "./access/AccessControlEnumerable.sol";
import "./token/ERC721/IERC721.sol";
import "./token/ERC721/IERC721Card.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/utils/ERC721Holder.sol";
import "./token/ERC20/utils/SafeERC20.sol";
import "./DogeFoodInvite.sol";

interface IMigratorChef {
    // Perform LP token migration from legacy UniswapV2 to ChaSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // ChaSwap must mint EXACTLY the same amount of ChaSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}

// DogeFoodPool is the master of Reward. He can make Reward and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once CHA is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract DogeFoodPool is
    Ownable,
    ERC721Holder,
    AccessControlEnumerable,
    DogeFoodInvite
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    bytes32 public constant SETUP_ROLE = keccak256("SETUP_ROLE");
    bytes32 public constant UPDATE_ROLE = keccak256("UPDATE_ROLE");

    // Miner information describe miner. One should has many Miners;
    struct MinerInfo {
        uint256 power; // basePower + groupPower
        uint256 basePower; // User self power
        uint256 startBlock; // 开始block
        uint256 endBlock; // 结束block
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint32 nft1;
        uint32 nft2;
        uint32 nft3;
    }
    // Info of each pool. pool is set manully.
    struct PoolInfo {
        uint256 chaPerBlock;
        uint256 startBlock;
        uint256 totalReward;
        uint256 totalPower;
    }

    event DepositWithNFT(
        address indexed user,
        uint256 indexed pid,
        uint256 idx,
        uint256 startBlock,
        uint256 endBlock,
        uint256 power,
        uint32 nft1,
        uint32 nft2,
        uint32 nft3
    );
    event Withdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 idx,
        uint256 power,
        uint32 nft1,
        uint32 nft2,
        uint32 nft3
    );
    event Harvest(
        address indexed user,
        uint256 indexed pid,
        uint256 idx,
        uint256 amount
    );
    event UpdateReward(
        address from,
        uint256 pid,
        uint256 accPershare,
        uint256 totalPower
    );

    IERC721Card public nftToken;
    uint256 public lastRewardBlock; // Last block number that CHAs distribution occurs.
    uint256 public accChaPerShare; // Accumulated CHAs per share, times 1e12. See below.

    IERC20 public chaToken;
    // Dev address.
    address public devaddr;
    address public blackholeAddress;
    address public poolAddress;
    address public liquidAddress;
    uint256 public globalReward;
    // Total released reward
    uint256 public releasedReward;
    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => uint256) public accPerShareList;
    mapping(address => uint256) public userPower;
    mapping(address => uint256) public minerCount;
    mapping(address => mapping(uint256 => MinerInfo)) public minerInfo;
    // mapping(address => MinerInfo[]) public minerInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when CHA mining starts.
    uint256 public startBlock;
    uint32 public oneDayBlock = 1 * 1200; // to Fixed
    uint32 public updatePerDay = 6; // to Fixed

    constructor(IERC20 _chaAddress, IERC721Card _nftAddress) {
        chaToken = _chaAddress;
        nftToken = IERC721Card(_nftAddress);
        // totalAllocPoint = totalAllocPoint.add(_allocPoint);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SETUP_ROLE, msg.sender);
        _setupRole(UPDATE_ROLE, msg.sender);
    }

    function releaseReward2(uint256 _pid) external view returns (uint256) {
        PoolInfo memory pool = poolInfo[_pid];
        return pool.totalPower.mul(accChaPerShare);
    }

    function remainReward(uint256 _pid) external view returns (uint256) {
        PoolInfo memory pool = poolInfo[_pid];
        return pool.totalReward - releasedReward;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function addPool(
        uint256 _chaPerBlock,
        uint256 _startBlock,
        uint256 _totalReward
    ) public {
        hasRole(SETUP_ROLE, _msgSender());
        _startBlock = block.number > _startBlock ? block.number : _startBlock;
        lastRewardBlock = _startBlock;
        poolInfo.push(
            PoolInfo({
                chaPerBlock: _chaPerBlock,
                startBlock: _startBlock,
                totalReward: _totalReward,
                totalPower: 5000
            })
        );
    }

    function setPool(
        uint256 _pid,
        uint256 _chaPerBlock,
        uint256 _startBlock,
        uint256 _totalReward
    ) public {
        hasRole(SETUP_ROLE, _msgSender());
        PoolInfo storage pool = poolInfo[_pid];
        pool.chaPerBlock = _chaPerBlock;
        pool.startBlock = _startBlock;
        pool.totalReward = _totalReward;
    }

    function setOneDayBlock(uint32 _oneDayBlock) public {
        hasRole(SETUP_ROLE, _msgSender());
        oneDayBlock = _oneDayBlock;
    }

    function setUpdatePerDay(uint32 _updatePerDay) public {
        hasRole(SETUP_ROLE, _msgSender());
        updatePerDay = _updatePerDay;
    }

    function setPanToken(address _chaAddress) public {
        hasRole(SETUP_ROLE, _msgSender());
        chaToken = IERC20(_chaAddress);
    }

    function setPoolReward(
        uint256 _pid,
        uint256 _chaPerBlock,
        uint256 _totalReward
    ) public {
        hasRole(SETUP_ROLE, _msgSender());
        PoolInfo storage pool = poolInfo[_pid];
        pool.chaPerBlock = _chaPerBlock;
        pool.totalReward = _totalReward;
    }

    // Set the migrator contract. Can only be called by the owner.
    // function setMigrator(IMigratorChef _migrator) public onlyOwner {
    //     migrator = _migrator;
    // }

    function getMultiplier(uint256 _from, uint256 _to)
        public
        pure
        returns (uint256)
    {
        return _to.sub(_from);
    }

    // View function to see pending CHA on frontend.
    function pendingReward(
        uint256 _pid,
        address _user,
        uint256 idx
    ) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        MinerInfo storage miner = minerInfo[_user][idx];
        uint256 endBlock = block.number;
        if (block.number > miner.endBlock) {
            endBlock = miner.endBlock;
        }
        if (pool.totalPower != 0) {
            uint256 accPerShare = getAccPerShare(endBlock);
            uint256 power = miner.power;

            return power.mul(accPerShare).sub(miner.rewardDebt);
        }
        return 0;
    }

    // Update reward variables of the given pool to be up-to-date.
    function updateReward(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        hasRole(UPDATE_ROLE, _msgSender());
        // uint256 remain = chaToken.balanceOf(address(this));
        uint256 remain = pool.totalReward.sub(releasedReward);
        if (remain <= 0) {
            return;
        }
        if (pool.totalPower == 0) {
            lastRewardBlock = block.number;
            return;
        }
        uint256 totalPower = pool.totalPower;
        require(lastRewardBlock <= block.number, "lastRewardBlock not valid");
        uint256 multiplier = getMultiplier(lastRewardBlock, block.number);
        uint256 chaReward = multiplier.mul(pool.chaPerBlock);
        if (remain < chaReward) {
            chaReward = remain;
        }
        releasedReward = releasedReward.add(chaReward);
        accChaPerShare = accChaPerShare.add(chaReward.div(totalPower));
        if (accPerShareList[block.number / (oneDayBlock / updatePerDay)] == 0)
            accPerShareList[
                block.number / (oneDayBlock / updatePerDay)
            ] = accChaPerShare;
        lastRewardBlock = block.number;
        emit UpdateReward(msg.sender, _pid, accChaPerShare, totalPower);
    }

    // Deposit LP tokens to DogeFoodPool for CHA allocation.
    function depositWithNFT(
        uint256 _pid,
        uint256 countday,
        uint32 nft1,
        uint32 nft2,
        uint32 nft3
    ) public {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 count = minerCount[msg.sender];
        MinerInfo memory miner = minerInfo[msg.sender][count];
        require(
            countday >= 7 && countday <= 30,
            "Depsite count day should between 7 and 30."
        );
        // require(
        //     nft1 > 0 && nft2 > 0 && nft3 > 0,
        //     "Depsite nft 1 2 3 should not be empty."
        // );
        // updateReward(0);
        require(
            (nftToken.ownerOf(nft1) == msg.sender),
            "Depsite nft 1 should be owner of you."
        );
        require(
            (nftToken.ownerOf(nft2) == msg.sender),
            "Depsite nft 2 should be owner of you."
        );
        require(
            (nftToken.ownerOf(nft3) == msg.sender),
            "Depsite nft 3 should be owner of you."
        );

        uint256 power = 0;
        power = power.add(nftToken.powerOf(nft1));
        nftToken.safeTransferFrom(msg.sender, address(this), nft1);
        power = power.add(nftToken.powerOf(nft2));
        nftToken.safeTransferFrom(msg.sender, address(this), nft2);
        power = power.add(nftToken.powerOf(nft3));
        nftToken.safeTransferFrom(msg.sender, address(this), nft3);
        power = power.mul(countday + 100).div(100);
        userPower[msg.sender] = userPower[msg.sender].add(power);
        miner.basePower = power;
        miner.power = power.add(getGroupPower(msg.sender));
        pool.totalPower = pool.totalPower.add(miner.power);
        uint256 blockNumber = block.number;
        miner.startBlock = blockNumber;
        miner.endBlock = blockNumber.add(countday * oneDayBlock); // toFixed
        miner.nft1 = uint32(nft1);
        miner.nft2 = uint32(nft2);
        miner.nft3 = uint32(nft3);
        uint256 accPerShare = getAccPerShare(block.number);
        miner.rewardDebt = miner.power.mul(accPerShare);
        minerCount[msg.sender] = count + 1;
        minerInfo[msg.sender][count] = miner;

        upGroupPower(msg.sender, miner.basePower);

        emit DepositWithNFT(
            msg.sender,
            _pid,
            count,
            miner.startBlock,
            miner.endBlock,
            miner.power,
            nft1,
            nft2,
            nft3
        );
    }

    function getAccPerShare(uint256 blockNumber)
        private
        view
        returns (uint256)
    {
        uint256 blockBase = blockNumber.div(oneDayBlock / updatePerDay);
        uint256 accPerShare = accPerShareList[blockBase];
        if (accPerShare == 0 && blockBase > 1)
            accPerShare = accPerShareList[blockBase - 1];
        if (accPerShare == 0 && blockBase > 2)
            accPerShare = accPerShareList[blockBase - 2];
        if (accPerShare == 0) accPerShare = accChaPerShare;
        return accPerShare;
    }

    // harvest LP tokens from DogeFoodPool.
    function harvest(uint256 _pid, uint256 _idx) public {
        // PoolInfo storage pool = poolInfo[_pid];
        MinerInfo storage miner = minerInfo[msg.sender][_pid];
        // updateReward(0);
        uint256 accPerShare = getAccPerShare(block.number);
        uint256 pending = miner.power.mul(accPerShare).sub(miner.rewardDebt);
        require(pending > 0, "harvest: none reward");
        safeChaTransfer(msg.sender, pending);
        miner.rewardDebt = miner.power.mul(accPerShare);
        emit Harvest(msg.sender, _pid, _idx, pending);
    }

    // Withdraw LP tokens from DogeFoodPool.
    function withdraw(uint256 _pid, uint256 _idx) public {
        uint256 pending;
        PoolInfo storage pool = poolInfo[_pid];
        MinerInfo storage miner = minerInfo[msg.sender][_idx];
        require(
            miner.endBlock <= block.number,
            "Cannot withdraw with days limit."
        );
        // require(accChaPerShare > 0, "accChaPerShare should not be zero");
        // updateReward(0);
        uint256 accPerShare = getAccPerShare(miner.endBlock);
        if (miner.power.mul(accPerShare) > miner.rewardDebt) {
            pending = miner.power.mul(accPerShare).sub(miner.rewardDebt);
            safeChaTransfer(msg.sender, pending);
        }

        if (miner.nft1 > 0) {
            nftToken.safeTransferFrom(address(this), msg.sender, miner.nft1);
        }
        if (miner.nft2 > 0) {
            nftToken.safeTransferFrom(address(this), msg.sender, miner.nft2);
        }
        if (miner.nft3 > 0) {
            nftToken.safeTransferFrom(address(this), msg.sender, miner.nft3);
        }

        // reduce power
        // uint256 power = miner.power.mul(_amount).div(miner.amount);
        pool.totalPower = pool.totalPower.sub(miner.power);

        userPower[msg.sender] = userPower[msg.sender].sub(miner.basePower);

        downGroupPower(msg.sender, miner.basePower);
        emit Withdraw(
            msg.sender,
            _pid,
            _idx,
            miner.power,
            miner.nft1,
            miner.nft2,
            miner.nft3
        );
        //  reduce amount
        miner.power = 0;
        miner.basePower = 0;
        miner.nft1 = 0;
        miner.nft2 = 0;
        miner.nft3 = 0;
        miner.rewardDebt = 0;
        // minerInfo[_pid][msg.sender] = 0;
    }

    // Safe chaToken transfer function, just in case if rounding error causes pool to not have enough CHA.
    function safeChaTransfer(address _to, uint256 _amount) internal {
        uint256 chaBalance = chaToken.balanceOf(address(this));
        if (_amount > chaBalance) {
            _amount = chaBalance;
        }
        // chaToken.transfer(blackholeAddress, _amount.mul(10).div(100));
        // chaToken.transfer(liquidAddress, _amount.mul(10).div(100));
        chaToken.transfer(_to, _amount.mul(100).div(100));
    }
}