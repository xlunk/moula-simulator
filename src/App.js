import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    // State for the game mechanics
    const [money, setMoney] = useState(() => Number(localStorage.getItem("money")) || 0);
    const [moneyPerClick, setMoneyPerClick] = useState(() => Number(localStorage.getItem("moneyPerClick")) || 1);
    const [autoEarnings, setAutoEarnings] = useState(() => Number(localStorage.getItem("autoEarnings")) || 0);
    const [prestigePoints, setPrestigePoints] = useState(() => Number(localStorage.getItem("prestigePoints")) || 0);
    const [rebirthCount, setRebirthCount] = useState(() => Number(localStorage.getItem("rebirthCount")) || 0);
    const [prestigeMultiplier, setPrestigeMultiplier] = useState(() => Number(localStorage.getItem("prestigeMultiplier")) || 1);
    const [prestigeCost, setPrestigeCost] = useState(() => Number(localStorage.getItem("prestigeCost")) || 1000);
    const [upgradePage, setUpgradePage] = useState(false);
    const [casinoOpen, setCasinoOpen] = useState(false);
    const [betColor, setBetColor] = useState("");
    const [upgradeMessages, setUpgradeMessages] = useState("");
    const [casinoOutcome, setCasinoOutcome] = useState("");

    // Save game data in localStorage on changes
    useEffect(() => {
        localStorage.setItem("money", money);
        localStorage.setItem("moneyPerClick", moneyPerClick);
        localStorage.setItem("autoEarnings", autoEarnings);
        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("rebirthCount", rebirthCount);
        localStorage.setItem("prestigeMultiplier", prestigeMultiplier);
        localStorage.setItem("prestigeCost", prestigeCost);
    }, [money, moneyPerClick, autoEarnings, prestigePoints, rebirthCount, prestigeMultiplier, prestigeCost]);

    // Click handler to earn money
    const handleClick = () => {
        setMoney(prev => prev + (moneyPerClick * prestigeMultiplier));
    };

    // Purchase upgrade, double its price after purchase
    const buyUpgrade = (cost, increase, upgradeName) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setMoneyPerClick(prev => prev + increase);
            setUpgradeMessages(`You purchased ${upgradeName} for $${cost}. The next one costs $${cost * 2}.`);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Purchase auto-earning upgrade
    const buyAutoEarnings = (cost, increase) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setAutoEarnings(prev => prev + increase);
            setUpgradeMessages(`You purchased Auto-Earnings for $${cost}.`);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Casino function: Open a menu where user types red or blue
    const openCasino = () => {
        setCasinoOpen(true);
    };

    const spinWheel = () => {
        if (betColor && money > 0) {
            const outcome = Math.random() < 0.5 ? "red" : "blue";
            setTimeout(() => {
                if (outcome === betColor) {
                    setMoney(prev => prev * 2); // Double the money
                    setCasinoOutcome(`The wheel landed on ${outcome}! You won and doubled your money!`);
                } else {
                    setMoney(0); // Lose all money
                    setCasinoOutcome(`The wheel landed on ${outcome}. You lost all your money.`);
                }
            }, 2000); // Simulate spin delay
            setCasinoOpen(false); // Close casino
        }
    };

    // Prestige system with scaling cost
    const prestige = () => {
        if (money >= prestigeCost) {
            setPrestigePoints(prev => prev + 1);
            setPrestigeMultiplier(prev => prev + 0.5);
            setMoney(0);
            setMoneyPerClick(1);
            setAutoEarnings(0);
            setRebirthCount(prev => prev + 1);
            setPrestigeCost(prev => prev * 2); // Double prestige cost
        }
    };

    // Auto earnings with a visual click effect
    useEffect(() => {
        const interval = setInterval(() => {
            setMoney(prev => prev + autoEarnings * prestigeMultiplier);
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
                {!upgradePage && !casinoOpen ? (
                    <>
                        <button onClick={handleClick} className="main-button">Click to Earn Money</button>
                        <button onClick={() => buyUpgrade(50, 2, 'Basic Upgrade')} disabled={money < 50} className="upgrade-button">Buy Upgrade (+$2 per click) (Cost: $50)</button>
                        <button onClick={() => buyAutoEarnings(100, 1)} disabled={money < 100} className="upgrade-button">Buy Auto-Earnings (+$1/sec) (Cost: $100)</button>
                        <button onClick={openCasino} className="casino-button">Open Casino</button>
                        <button onClick={prestige} disabled={money < prestigeCost} className="prestige-button">Prestige (Cost: ${prestigeCost})</button>
                        <button onClick={() => setUpgradePage(true)} className="upgrade-page-button">Go to Upgrades Page</button>
                        {upgradeMessages && <p className="upgrade-message">{upgradeMessages}</p>}
                    </>
                ) : upgradePage ? (
                    <>
                        <button onClick={() => setUpgradePage(false)} className="back-button">Back to Main Game</button>
                        <h2>Upgrades</h2>
                        <button onClick={() => buyUpgrade(100, 5, 'New House')} disabled={money < 100} className="upgrade-button">Buy New House (Cost: $100)</button>
                        <button onClick={() => buyUpgrade(200, 10, 'Machine')} disabled={money < 200} className="upgrade-button">Buy Machine (Cost: $200)</button>
                        <button onClick={() => buyUpgrade(500, 20, 'Food Production')} disabled={money < 500} className="upgrade-button">Buy Food Production (Cost: $500)</button>
                    </>
                ) : casinoOpen ? (
                    <>
                    <button onClick={() => setCasinoPage(false)} className="back-button">Back to Main Game</button>

                        <h2>Casino - Choose Red or Blue</h2>
                        <input value={betColor} onChange={(e) => setBetColor(e.target.value.toLowerCase())} placeholder="Type 'red' or 'blue'" />
                        <button onClick={spinWheel} className="casino-spin-button">Spin the Wheel</button>
                        {casinoOutcome && <p className="casino-outcome">{casinoOutcome}</p>}
                    </>
                ) : null}
            </div>

            <footer className="footer">Game by: @xlnk</footer>
        </div>
    );
};

export default App;
