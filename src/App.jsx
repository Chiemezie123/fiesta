import { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Link,
  Container,
  Divider,
  Card,
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import { Keypair, SorobanRpc, TransactionBuilder, Asset, Operation, LiquidityPoolAsset, getLiquidityPoolId, BASE_FEE, Networks } from '@stellar/stellar-sdk';

const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

function App() {
  const [keypair, setKeypair] = useState(null);
  const [log, setLog] = useState('');
  const [liquidityPoolId, setLiquidityPoolId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState({
    generateKeypair: false,
    fundAccount: false,
    createLiquidityPool: false,
    withdrawFromPool: false,
  });
 
  const addLog = (message) => {
    setLog(message);
  };

  const generateKeypair = () => {
    setLoading((prev) => ({ ...prev, generateKeypair: true }));
    const newKeypair = Keypair.random();
    setKeypair(newKeypair);
    addLog(`Generated new keypair. Public key: ${newKeypair.publicKey()}`);
    setLoading((prev) => ({ ...prev, generateKeypair: false }));
  };

  const fundAccount = async () => {
    if (!keypair) {
      addLog('Please generate a keypair first.');
      return;
    }

    setLoading((prev) => ({ ...prev, fundAccount: true }));
    const friendbotUrl = `https://friendbot.stellar.org?addr=${keypair.publicKey()}`;
    try {
      const response = await fetch(friendbotUrl);
      if (response.ok) {
        addLog(`Account ${keypair.publicKey()} successfully funded.`);
      } else {
        addLog(`Something went wrong funding account: ${keypair.publicKey()}.`);
      }
    } catch (error) {
      addLog( 'funding account ${keypair.publicKey()}: ${error.message}');
    }
    setLoading((prev) => ({ ...prev, fundAccount: false }));
  };

  const createLiquidityPool = async () => {
    if (!keypair || !assetName || !tokenAAmount || !tokenBAmount) {
      addLog('Please ensure you have a keypair, asset name, and token amounts.');
      return;
    }

    setLoading((prev) => ({ ...prev, createLiquidityPool: true }));
    try {
      const account = await server.getAccount(keypair.publicKey());
      const customAsset = new Asset(assetName, keypair.publicKey());
      const lpAsset = new LiquidityPoolAsset(Asset.native(), customAsset, 30);
      const lpId = getLiquidityPoolId('constant_product', lpAsset).toString('hex');
      setLiquidityPoolId(lpId);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.changeTrust({ asset: lpAsset }))
        .addOperation(
          Operation.liquidityPoolDeposit({
            liquidityPoolId: lpId,
            maxAmountA: tokenAAmount,
            maxAmountB: tokenBAmount,
            minPrice: { n: 1, d: 1 },
            maxPrice: { n: 1, d: 1 },
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(keypair);
      const result = await server.sendTransaction(transaction);
      addLog(
        <>
          Liquidity Pool created. Transaction URL:{' '}
          <Link
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            View Transaction
          </Link>
        </>
      );
    } catch (error) {
      addLog( `creating Liquidity Pool: ${error.message}`);
    }
    setLoading((prev) => ({ ...prev, createLiquidityPool: false }));
  };

  const withdrawFromPool = async () => {
    if (!keypair || !liquidityPoolId || !withdrawAmount) {
      addLog('Please ensure you have a keypair, liquidity pool ID, and withdrawal amount.');
      return;
    }

    setLoading((prev) => ({ ...prev, withdrawFromPool: true }));
    try {
      const account = await server.getAccount(keypair.publicKey());
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.liquidityPoolWithdraw({
            liquidityPoolId: liquidityPoolId,
            amount: withdrawAmount,
            minAmountA: '0',
            minAmountB: '0',
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(keypair);
      const result = await server.sendTransaction(transaction);
      addLog(
        <>
          Withdrawal successful. Transaction URL:{' '}
          <Link
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            View Transaction
          </Link>
        </>
      );
    } catch (error) {
      addLog( `withdrawing from Liquidity Pool: ${error.message}`);
    }
    setLoading((prev) => ({ ...prev, withdrawFromPool: false }));
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 4,
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#bc560a' }}>
        <Toolbar sx={{ justifyContent: 'center', position: 'relative' }}>
          <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Fiesta DeFi Liquidity Pool
          </Typography>
        </Toolbar>
      </AppBar> 
      <Grid 
  container 
  spacing={6} 
  sx={{ 
    mt: 4, 
    mb: 4, 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  }}
>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Generate Keypair here
              </Typography>
              <Button
                variant="contained"
                onClick={generateKeypair}
                fullWidth
                disabled={loading.generateKeypair}
                sx={{
                  backgroundColor: '#A633FF',
                  '&:hover': { backgroundColor: '#3333FF' },
                  borderRadius: '8px',
                }}
              >
                {loading.generateKeypair ? <CircularProgress size={24} /> : 'Generate Keypair'}
              </Button>
              <Typography variant="h6" sx={{ mt: 4 }}>
                please fund account here
              </Typography>
              <Button
                variant="contained"
                onClick={fundAccount}
                fullWidth
                disabled={loading.fundAccount}
                sx={{
                  backgroundColor: '#33FF96',
                  '&:hover': { backgroundColor: '#33FFC7' },
                  borderRadius: '8px',
                }}
              >
                {loading.fundAccount ? <CircularProgress size={24} /> : 'Fund Account'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Withdraw from the  Pool
              </Typography>
              <TextField
                label="Withdrawal Amount"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={withdrawFromPool}
                fullWidth
                disabled={loading.withdrawFromPool}
                sx={{
                  backgroundColor: '#33FF33',
                  '&:hover': { backgroundColor: '#FF5733' },
                  borderRadius: '8px',
                }}
              >
                {loading.withdrawFromPool ? <CircularProgress size={24} /> : 'Withdraw from Pool'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Create Liquidity Pool
              </Typography>
              <TextField
                label="Asset Name"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setAssetName(e.target.value)}
              />
              <TextField
                label="Token A Amount"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setTokenAAmount(e.target.value)}
              />
              <TextField
                label="Token B Amount"
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setTokenBAmount(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={createLiquidityPool}
                fullWidth
                disabled={loading.createLiquidityPool}
                sx={{
                  backgroundColor: '#B833FF',
                  '&:hover': { backgroundColor: '#9633FF' },
                  borderRadius: '8px',
                }}
              >
                {loading.createLiquidityPool ? <CircularProgress size={24} /> : 'Create Liquidity Pool'}
              </Button>
              {liquidityPoolId && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  The Liquidity Pool ID: {liquidityPoolId}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>    
      <Paper sx={{ mt: 4, p: 2, width: '100%' }}>
        <Typography variant="h6">Log</Typography>
        <Divider />
        <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto' }}>
          <Typography variant="body2">{log}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;