import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../constants';
import VaultCoreABI from '../abis/VaultCore.json';
import StrategyManagerABI from '../abis/StrategyManager.json';
import MockUSDCABI from '../abis/MockUSDC.json';

export function useVaultCore() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = (amount: bigint, receiver?: string) => {
        if (!address && !receiver) return;
        writeContract({
            address: CONTRACT_ADDRESSES.VaultCore as `0x${string}`,
            abi: VaultCoreABI,
            functionName: 'deposit',
            args: [amount, receiver || address],
        });
    };

    const withdraw = (assets: bigint, receiver?: string, owner?: string) => {
        if (!address && (!receiver || !owner)) return;
        writeContract({
            address: CONTRACT_ADDRESSES.VaultCore as `0x${string}`,
            abi: VaultCoreABI,
            functionName: 'withdraw',
            args: [assets, receiver || address, owner || address],
        });
    };

    return {
        deposit,
        withdraw,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
}

export function useVaultData() {
    const { address } = useAccount();

    const { data: totalAssets, refetch: refetchTotalAssets } = useReadContract({
        address: CONTRACT_ADDRESSES.VaultCore as `0x${string}`,
        abi: VaultCoreABI,
        functionName: 'totalAssets',
    });

    const { data: balanceOf, refetch: refetchBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.VaultCore as `0x${string}`,
        abi: VaultCoreABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const refetch = () => {
        refetchTotalAssets();
        refetchBalance();
    };

    return {
        totalAssets: totalAssets as bigint | undefined,
        balanceOf: balanceOf as bigint | undefined,
        refetch,
        isLoading: false,
    };
}

export function useUSDC() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: bigint, spender: string = CONTRACT_ADDRESSES.VaultCore) => {
        writeContract({
            address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
            abi: MockUSDCABI,
            functionName: 'approve',
            args: [spender, amount],
        });
    };

    const mint = (to: string, amount: bigint) => {
        writeContract({
            address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
            abi: MockUSDCABI,
            functionName: 'mint',
            args: [to, amount],
        });
    };

    return {
        approve,
        mint,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
}

export function useUSDCData() {
    const { address } = useAccount();

    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.VaultCore] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const refetch = () => {
        refetchBalance();
        refetchAllowance();
    };

    return {
        balance: balance as bigint | undefined,
        allowance: allowance as bigint | undefined,
        refetch,
        isLoading: false,
    };
}
