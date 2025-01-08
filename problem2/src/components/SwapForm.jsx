import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function SwapForm() {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [swappedAmount, setSwappedAmount] = useState('');
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swapping, setSwapping] = useState(false);
  
  // New validation states
  const [amountError, setAmountError] = useState('');
  const [currencyError, setCurrencyError] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          'https://interview.switcheo.com/prices.json'
        );
        // Convert array to object with currency as key
        const prices = response.data.reduce((acc, curr) => {
          acc[curr.currency] = curr.price;
          return acc;
        }, {});
        setPriceData(prices);
        // Set initial currencies after data is loaded
        setFromCurrency('USD');
        setToCurrency('ETH');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError('Failed to fetch price data');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const currencies = Object.keys(priceData);

  const handleSwapDirection = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount('');
    setSwappedAmount('');
  };

  const validateAmount = (value) => {
    if (!value) {
      setAmountError('Amount is required');
      return false;
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      setAmountError('Please enter a valid positive number');
      return false;
    }
    if (value.includes('.') && value.split('.')[1].length > 6) {
      setAmountError('Maximum 6 decimal places allowed');
      return false;
    }
    setAmountError('');
    return true;
  };

  const validateCurrencies = () => {
    if (fromCurrency === toCurrency) {
      setCurrencyError('Please select different currencies');
      return false;
    }
    setCurrencyError('');
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setSwappedAmount('');
    validateAmount(value);
  };

  const handleFromCurrencyChange = (e) => {
    const value = e.target.value;
    setFromCurrency(value);
    setSwappedAmount('');
    if (value === toCurrency) {
      setCurrencyError('Please select different currencies');
    } else {
      setCurrencyError('');
    }
  };

  const handleToCurrencyChange = (e) => {
    const value = e.target.value;
    setToCurrency(value);
    setSwappedAmount('');
    if (value === fromCurrency) {
      setCurrencyError('Please select different currencies');
    } else {
      setCurrencyError('');
    }
  };

  const handleSwapSubmit = () => {
    if (!validateAmount(amount) || !validateCurrencies()) {
      return;
    }
    
    setSwapping(true);
    setTimeout(() => {
      const calculatedAmount = calculateSwapAmount();
      setSwappedAmount(calculatedAmount);
      setSwapping(false);
    }, 2000);
  };

  const calculateSwapAmount = () => {
    if (!amount) return '';
    const fromRate = priceData[fromCurrency];
    const toRate = priceData[toCurrency];
    return ((amount * fromRate) / toRate).toFixed(6);
  };

  const renderCurrencyIcon = (currency) => {
    return (
      <Box
        component="img"
        src={`/icons/tokens/${currency}.svg`}
        alt={currency}
        sx={{
          width: 24,
          height: 24,
          mr: 1,
          objectFit: 'contain',
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Swap Currencies
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="From Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            error={!!amountError}
            helperText={amountError}
            sx={{ mb: 1 }}
          />
          <FormControl 
            fullWidth 
            error={!!currencyError}
          >
            <InputLabel>From Currency</InputLabel>
            <Select
              value={fromCurrency}
              label="From Currency"
              onChange={handleFromCurrencyChange}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderCurrencyIcon(value)}
                  {value}
                </Box>
              )}
            >
              {currencies.map((currency) => (
                <MenuItem
                  key={currency}
                  value={currency}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {renderCurrencyIcon(currency)}
                  {currency}
                </MenuItem>
              ))}
            </Select>
            {currencyError && <FormHelperText>{currencyError}</FormHelperText>}
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <IconButton onClick={handleSwapDirection} color="primary">
            <SwapVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="To Amount"
            value={swappedAmount}
            disabled
            sx={{ mb: 1 }}
          />
          <FormControl 
            fullWidth
            error={!!currencyError}
          >
            <InputLabel>To Currency</InputLabel>
            <Select
              value={toCurrency}
              label="To Currency"
              onChange={handleToCurrencyChange}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderCurrencyIcon(value)}
                  {value}
                </Box>
              )}
            >
              {currencies.map((currency) => (
                <MenuItem
                  key={currency}
                  value={currency}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {renderCurrencyIcon(currency)}
                  {currency}
                </MenuItem>
              ))}
            </Select>
            {currencyError && <FormHelperText>{currencyError}</FormHelperText>}
          </FormControl>
        </Box>

        <Button 
          variant="contained" 
          fullWidth
          disabled={!amount || !!amountError || !!currencyError || swapping}
          onClick={handleSwapSubmit}
          startIcon={swapping ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {swapping ? 'Swapping...' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  );
}
