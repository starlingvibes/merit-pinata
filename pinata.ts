const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');
import { Keypair } from '@solana/web3.js';
import idl from './public/pinata.json';
import walletKey from './wallet.json';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const connection = new Connection(
    process.env.CUSTOM_MAINNET_RPC,
    'confirmed'
  );

  const wallet = Keypair.fromSecretKey(new Uint8Array(walletKey));

  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: 'confirmed' }
  );

  const programId = new PublicKey(
    'fptsDJsnrCJGFzewgoyNx2mYgcbhELzsjL9MJHn4HS3'
  );

  const program = new anchor.Program(idl, programId, provider);

  let confirmOptions = {
    skipPreflight: true,
  };

  try {
    const tx = await program.methods
      .claimDistribution(null)
      .accounts({
        treasury: new PublicKey('3KYiD2xRcCdgVyPPBmiZU8rHTvEuRR3fx7wG5q2r7ouQ'),
        authority: wallet.publicKey,
        treasuryMint: new PublicKey(
          'doubzbhGgoAcxFMYoySkpubAMA5j11dZ5dsn9jF6N1V'
        ),
        receiverPointsTokenAccount: new PublicKey(
          process.env.MY_POINTS_TOKEN_ACCOUNT
        ),
        distributionPotMint: new PublicKey(
          'J9BcrQfX4p9D1bvLzRNCbMDv8f44a9LFdeqNE4Yk2WMD'
        ),
        distributionPot: new PublicKey(
          '4FvKSEk6NsXgdwwyJFp6m7T2ZzKGSwZvgXFqWTM6YK8k'
        ),
        receiverDistributionTag: new PublicKey(process.env.MY_DISTRIBUTION_TAG),
        distributionPotTokenAccount: new PublicKey(
          'AhkBG6fGNderL8xvNGyzzQaZYndVMvmHa69R1rd5ytTt'
        ),
        receiverDistributionPotTokenAccount: new PublicKey(
          process.env.MY_DISTRIBUTION_POT_TOKEN_ACCOUNT
        ),
        receiver: wallet.publicKey,
        distributionPotTokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc(confirmOptions);
    console.log('Transaction signature', tx);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
