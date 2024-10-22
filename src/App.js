import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [money, setMoney] = useState(0);
    const [moneyPerClick, setMoneyPerClick] = useState(1);
    const [autoEarnings, setAutoEarnings] = useState(0);
    const [prestigePoints, setPrestigePoints] = useState(0);
    const [rebirthCount, setRebirthCount] = useState(0);
    const [prestigeMultiplier, setPrestigeMultiplier] = useState(1);
    const [upgrades, setUpgrades] = useState([]);

    const handleClick = () => {
        setMoney((prev) => prev + moneyPerClick * prestigeMultiplier);
    };

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

    const casino = () => {
        if (money > 0) {
            const gamble = Math.random() < 0.5;
            if (gamble) {
                setMoney((prev) => prev * 2);
                alert("You won! Your money has doubled!");
            } else {
                setMoney(0);
                alert("You lost all your money!");
            }
        }
    };

    const prestige = () => {
        if (money >= 1000) {
            setPrestigePoints((prev) => prev + 1);
            setPrestigeMultiplier((prev) => prev + 0.5);
            setMoney(0);
            setMoneyPerClick(1);
            setAutoEarnings(0);
            setRebirthCount((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setMoney((prev) => prev + autoEarnings * prestigeMultiplier);
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

            <div className="button-container">
                <button onClick={handleClick} className="main-button">Click to Earn Money</button>
                <button onClick={() => buyUpgrade(50, 2)} disabled={money < 50} className="upgrade-button">
                    Buy Upgrade (+$2 per click) (Cost: $50)
                </button>
                <button onClick={buyAutoEarnings} disabled={money < 100} className="upgrade-button">
                    Buy Auto-Earnings (+$1/sec) (Cost: $100)
                </button>
                <button onClick={casino} disabled={money === 0} className="casino-button">Casino: Gamble All Your Money</button>
                <button onClick={prestige} disabled={money < 1000} className="prestige-button">Prestige (Cost: $1000)</button>
            </div>
        </div>
    );
};

export default App;
