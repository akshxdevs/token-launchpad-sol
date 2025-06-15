import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

export async function createAtaAndMint({
  connection,
  mintKeypair,
  walletPublicKey,
  sendTransaction,
  amount,
}: {
  connection: Connection;
  mintKeypair: any; // You can type this as Keypair if needed
  walletPublicKey: PublicKey;
  sendTransaction: (tx: Transaction, conn: Connection) => Promise<string>;
  amount: number;
}) {
  const ata = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    walletPublicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const ataTx = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      walletPublicKey,
      ata,
      walletPublicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    )
  );
  await sendTransaction(ataTx, connection);

  const mintTx = new Transaction().add(
    createMintToInstruction(
      mintKeypair.publicKey,
      ata,
      walletPublicKey,
      amount,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );
  await sendTransaction(mintTx, connection);

  return ata;
}
