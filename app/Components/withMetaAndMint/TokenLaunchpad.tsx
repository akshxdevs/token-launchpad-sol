'use client';

import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    useConnection,
    useWallet
} from '@solana/wallet-adapter-react';
import {
    TOKEN_2022_PROGRAM_ID,
    getMintLen,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    ExtensionType,
    TYPE_SIZE,
    LENGTH_SIZE,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getAssociatedTokenAddressSync,
    createBurnInstruction,
    createCloseAccountInstruction,
    getAccount
} from "@solana/spl-token";
import {
    createInitializeInstruction,
    pack
} from '@solana/spl-token-metadata';
import React, { useRef, useState } from 'react';
import { RainbowButton } from "./Components/ui/RainbowButton";

export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const mintKeypairRef = useRef<Keypair | null>(null);
    const [mintAddressBase58,setMintAddressBase58] = useState<string>("");
    const [tokenName,setTokenName] = useState("")
    const [tokenSymbol,setTokenSymbol] = useState("")
    const [tokenSupply,setTokenSupply] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    async function createTokenAKS() {
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.sendTransaction) {
            console.error("Wallet not connected properly.");
            return;
        }

        const mintKeypair = Keypair.generate();
        mintKeypairRef.current = mintKeypair;

        const metadata = {
            mint: mintKeypair.publicKey,
            name: 'AKSH',
            symbol: 'AKA',
            uri: 'https://gateway.pinata.cloud/ipfs/bafkreiglmdafkc4cw4gedecijkccbhtlkatggpba35ldx2zmw3s73x2lga',
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const tx1 = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                mintKeypair.publicKey,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                9,
                wallet.publicKey,
                null,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            })
        );

        tx1.feePayer = wallet.publicKey;
        tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx1.partialSign(mintKeypair);

        await wallet.sendTransaction(tx1, connection);
        console.log(`Mint created at: ${mintKeypair.publicKey.toBase58()}`);

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        );

        const tx2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            )
        );
        await wallet.sendTransaction(tx2, connection);
        console.log(`Associated Token Account: ${associatedToken.toBase58()}`);

        const supply = 1_000_000_000;
        const tx3 = new Transaction().add(
            createMintToInstruction(
                mintKeypair.publicKey,
                associatedToken,
                wallet.publicKey,
                supply,
                [],
                TOKEN_2022_PROGRAM_ID
            )
        );
        await wallet.sendTransaction(tx3, connection);
        alert(`Minted ${supply} token to ATA`);
    }

        async function createToken() {
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.sendTransaction) {
            console.error("Wallet not connected properly.");
            return;
        }

        const mintKeypair = Keypair.generate();
        mintKeypairRef.current = mintKeypair;

        const metadata = {
            mint: mintKeypair.publicKey,
            name: tokenName,
            symbol: tokenSymbol,
            uri: imgUrl||'https://gateway.pinata.cloud/ipfs/bafkreiglmdafkc4cw4gedecijkccbhtlkatggpba35ldx2zmw3s73x2lga',
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const tx1 = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                mintKeypair.publicKey,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                9,
                wallet.publicKey,
                null,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            })
        );

        tx1.feePayer = wallet.publicKey;
        tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx1.partialSign(mintKeypair);

        await wallet.sendTransaction(tx1, connection);
        console.log(`Mint created at: ${mintKeypair.publicKey.toBase58()}`);

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        );

        const tx2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            )
        );
        await wallet.sendTransaction(tx2, connection);
        console.log(`Associated Token Account: ${associatedToken.toBase58()}`);

        const supply = Number(tokenSupply) * 1_000_000_000;
        const tx3 = new Transaction().add(
            createMintToInstruction(
                mintKeypair.publicKey,
                associatedToken,
                wallet.publicKey,
                supply,
                [],
                TOKEN_2022_PROGRAM_ID
            )
        );
        await wallet.sendTransaction(tx3, connection);
        alert(`Minted ${tokenSupply} token to ATA`);
    }

    async function burnAndCloseToken() {
        if (!wallet.publicKey || !wallet.sendTransaction) {
            console.error("Wallet not connected.");
            return;
        }

        const mintKeypair = mintKeypairRef.current;
        if (!mintKeypair) {
            alert("Mint not initialized.");
            return;
        }

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        );

        try {
            const account = await getAccount(connection, associatedToken, undefined, TOKEN_2022_PROGRAM_ID);
            if (Number(account.amount) === 0) {
                alert("No tokens to burn.");
                return;
            }

            const burnIx = createBurnInstruction(
                associatedToken,
                mintKeypair.publicKey,
                wallet.publicKey,
                account.amount,
                [],
                TOKEN_2022_PROGRAM_ID
            );

            const closeIx = createCloseAccountInstruction(
                associatedToken,
                wallet.publicKey,
                wallet.publicKey,
                [],
                TOKEN_2022_PROGRAM_ID
            );

            const tx = new Transaction().add(burnIx, closeIx);
            await wallet.sendTransaction(tx, connection);
            alert('Burned & closed token account.');
        } catch (err) {
            console.error("Burn/Close failed:", err);
            alert("Burn failed. Check console.");
        }
    }

    async function burnOldToken() {
    if (!wallet.publicKey || !wallet.sendTransaction) {
        console.error("Wallet not connected.");
        return;
    }

    try {
        const mintAddress = new PublicKey(mintAddressBase58);
        const associatedToken = getAssociatedTokenAddressSync(
            mintAddress,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        );

        const account = await getAccount(
            connection,
            associatedToken,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

        const burnIx = createBurnInstruction(
            associatedToken,
            mintAddress,
            wallet.publicKey,
            account.amount,
            [],
            TOKEN_2022_PROGRAM_ID
        );

        const closeIx = createCloseAccountInstruction(
            associatedToken,
            wallet.publicKey,
            wallet.publicKey,
            [],
            TOKEN_2022_PROGRAM_ID
        );

        const tx = new Transaction().add(burnIx, closeIx);
        await wallet.sendTransaction(tx, connection);
        alert("Old token burned and closed successfully!");
        setMintAddressBase58("");
    } catch (err) {
        console.error("Burn error:", err);
        alert("Error burning token: " + err);
    }
}

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-black text-white space-y-4">
            <h1 className="text-4xl font-bold freaky-text animate-freaky">Solana Token Launchpad</h1>
            <p className="text-gray-400 w-64">Claim the Airdrop one my token $AKS for free click the below button</p>
            <RainbowButton onClick={createTokenAKS}><img src="/love-cute.gif" alt="fire" className="w-6 h-6 mx-2" /><span>AKS Token</span></RainbowButton>
            <div className="border-t px-24 border-gray-500"></div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-gray-400 fade-in-up">Create your own token here!</h1>
            <div className="min-w-62 flex flex-col justify-center items-center gap-3">
                <input type="text" placeholder="*Enter token name" className="w-full text-black p-2 rounded-lg " value={tokenName} onChange={(e)=>setTokenName(e.target.value)}/>
                <input type="text" placeholder="*Enter token Symbol" className="w-full text-black p-2 rounded-lg " value={tokenSymbol} onChange={(e)=>setTokenSymbol(e.target.value)}/>
                <div className="flex flex-col gap-2 border p-2 rounded-lg border-gray-700"> 
                    <input type="text" placeholder="Enter image URL (e.g. from IPFS)" className="w-full text-black p-2 rounded-lg " value={imgUrl}onChange={(e) => setImgUrl(e.target.value)}/>
                    <p className="text-xs font-semibold text-gray-300">Paste the image URL here, or leave it blank to use the default</p>
                </div>
                <input type="text" placeholder="*Token supply (e.g., 1)" className="w-full text-black p-2 rounded-lg " value={tokenSupply} onChange={(e)=>setTokenSupply(e.target.value)}/>
            </div>
            <div className="flex gap-4">
                <RainbowButton onClick={createToken}><img src="/love-cute.gif" alt="fire" className="w-6 h-6 mx-2" /><span>Token</span></RainbowButton>
                <RainbowButton onClick={burnAndCloseToken}><img src="/пламя.gif" alt="fire" className="w-6 h-6 mx-2" /> <span>& Remove</span></RainbowButton>
            </div>
            <div className="border-t px-24 border-gray-500"></div>
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-2 justify-center items-center">
                    <img src="/пламя.gif" alt="fire" className="w-6 h-6 mx-2" />
                    <h1 className="text-lg font-semibold"> Your old tokens here!</h1>
                </div>
                <input type="text" placeholder="paste the mint address here.." className="text-black p-2 rounded-lg " value={mintAddressBase58} onChange={(e:any)=>setMintAddressBase58(e.target.value)} />
                <RainbowButton onClick={burnOldToken}> <img src="/пламя.gif" alt="fire" className="w-6 h-6 mx-2" /><span>Token</span></RainbowButton>
            </div>
        </div>
    );
}
