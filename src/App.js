import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [money, setMoney] = useState(0);
    const [moneyPerClick, setMoneyPerClick] = useState(1);
    const [autoEarnings, setAutoEarnings] = useState(0);
    const [prestigePoints, setPrestigePoints] = useState(0);
    const [rebirthCount, setRebirthCount] = useState(0);
    const [prestigeMultiplier, setPrestigeMultiplier] = useState(1);
    const [upgradePage, setUpgradePage] = useState(false);
    const [prestigeCost, setPrestigeCost] = useState(1000);
    const [autoClickerVisual, setAutoClickerVisual] = useState(false);

    // Click handler to earn money
    const handleClick = () => {
        setMoney((prev) => prev + (moneyPerClick * prestigeMultiplier));
    };

    // Dynamic pricing for upgrades
    const buyUpgrade = (cost, increase) => {
        if (money >= cost) {
            setMoney((prev) => prev - cost);
            setMoneyPerClick((prev) => prev + increase);
        }
    };

    const buyAutoEarnings = () => {
        if (money >= 100) {
            setMoney((prev) => prev - 100);
            setAutoEarnings((prev) => prev + 1);
        }
    };

    // Casino with user-defined bet amount and a wheel spin effect
    const casino = (bet) => {
        if (money >= bet) {
            setMoney((prev) => prev - bet);
            const gamble = Math.random() < 0.5;
            setTimeout(() => {
                if (gamble) {
                    setMoney((prev) => prev + bet * 2);
                    alert("You won! You doubled your money!");
                } else {
                    alert("You lost!");
                }
            }, 2000); // Simulates wheel spin time
        }
    };

    // Prestige system with scaling cost
    const prestige = () => {
        if (money >= prestigeCost) {
            setPrestigePoints((prev) => prev + 1);
            setPrestigeMultiplier((prev) => prev + 0.5);
            setMoney(0);
            setMoneyPerClick(1);
            setAutoEarnings(0);
            setRebirthCount((prev) => prev + 1);
            setPrestigeCost((prev) => prev * 2); // Doubles prestige cost
        }
    };

    // Auto earnings with a visual click effect
    useEffect(() => {
        const interval = setInterval(() => {
            setMoney((prev) => prev + autoEarnings * prestigeMultiplier);
            if (autoEarnings > 0) {
                setAutoClickerVisual(true);
                setTimeout(() => setAutoClickerVisual(false), 100); // Visual arrow click
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [autoEarnings, prestigeMultiplier]);

    return (
        <div className="App">
            <h1 className="title">Moula Moula</h1>
            <h2 className="money">Money: ${money.toFixed(2)}</h2>
            <h3>Money Per Click: ${moneyPerClick * prestigeMultiplier}</h3>
            <h3>Auto Earnings: ${autoEarnings * prestigeMultiplier}/sec</h3>
            <h3>Prestige Points: {prestigePoints}</h3>
            <h3>Prestige Multiplier: x{prestigeMultiplier}</h3>
            <h3>Rebirth Count: {rebirthCount}</h3>
            <h3>Prestige Cost: ${prestigeCost}</h3>

            <div className="button-container">
                {!upgradePage ? (
                    <>
                        <button onClick={handleClick} className="main-button">
                            {autoClickerVisual && <span className="auto-clicker">→</span>}
                            Click to Earn Money
                        </button>
                        <button onClick={() => buyUpgrade(50, 2)} disabled={money < 50} className="upgrade-button">
                            Buy Upgrade (+$2 per click) (Cost: $50)
                        </button>
                        <button onClick={buyAutoEarnings} disabled={money < 100} className="upgrade-button">
                            Buy Auto-Earnings (+$1/sec) (Cost: $100)
                        </button>
                        <button onClick={() => casino(100)} disabled={money < 100} className="casino-button">
                            Gamble $100
                        </button>
                        <button onClick={prestige} disabled={money < prestigeCost} className="prestige-button">
                            Prestige (Cost: ${prestigeCost})
                        </button>
                        <button onClick={() => setUpgradePage(true)} className="upgrade-page-button">
                            Go to Upgrades Page
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setUpgradePage(false)} className="back-button">
                            Back to Main Game
                        </button>
                        <h2>Upgrades</h2>
                        <button onClick={() => buyUpgrade(100, 5)} disabled={money < 100} className="upgrade-button">
                            Buy New House (Cost: $100)
                        </button>
                        <button onClick={() => buyUpgrade(200, 10)} disabled={money < 200} className="upgrade-button">
                            Buy Machine (Cost: $200)
                        </button>
                        <button onClick={() => buyUpgrade(500, 20)} disabled={money < 500} className="upgrade-button">
                            Buy Food Production (Cost: $500)
                        </button>
                    </>
                )}
            </div>

            <footer className="footer">Game by: @xlnk</footer>
        </div>
    );
};

export default App;
