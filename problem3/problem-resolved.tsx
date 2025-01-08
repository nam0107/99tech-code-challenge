// Define supported blockchains to improve type safety
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
  id: string; // Added for proper React keys
}

interface Props extends BoxProps {
  // Remove children if not used
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: Blockchain): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // Only show balances with positive amounts
        return balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Sort by amount if priorities are equal
        return rhs.amount - lhs.amount;
      })
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue,
        };
      });
  }, [balances, prices]); // prices is now used in the calculation

  return (
    <div {...rest}>
      {sortedAndFormattedBalances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={balance.id} // Using proper unique key
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
