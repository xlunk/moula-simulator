import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [money, setMoney] = useState(() => Number(localStorage.getItem("money")) || 0);
    const [moneyPerClick, setMoneyPerClick] = useState(() => Number(localStorage.getItem("moneyPerClick")) || 1);
    const [autoEarnings, setAutoEarnings] = useState(() => Number(localStorage.getItem("autoEarnings")) || 0);
    const [prestigePoints, setPrestigePoints] = useState(() => Number(localStorage.getItem("prestigePoints")) || 0);
    const [prestigeCount, setPrestigeCount] = useState(() => Number(localStorage.getItem("rebirthCount")) || 0); // renamed to prestigeCount
    const [prestigeMultiplier, setPrestigeMultiplier] = useState(() => Number(localStorage.getItem("prestigeMultiplier")) || 1);
    const [prestigeCost, setPrestigeCost] = useState(() => Number(localStorage.getItem("prestigeCost")) || 1000);
    const [upgradePage, setUpgradePage] = useState(false);
    const [casinoOpen, setCasinoOpen] = useState(false);
    const [casinoOutcome, setCasinoOutcome] = useState("");
    const [betColor, setBetColor] = useState("");
    const [wheelSpin, setWheelSpin] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // popup for win/loss
    const [luckOpen, setLuckOpen] = useState(false); // For "Test Your Luck" feature
    const [prize, setPrize] = useState(null); // Track the prize
    const [playTime, setPlayTime] = useState(0); // Track playtime

    // Prize pool for "Test Your Luck"
    const prizePool = [
        { name: 'Small Prize', value: 10000, chance: 0.6 },
        { name: 'Medium Prize', value: 50000, chance: 0.3 },
        { name: 'Big Prize', value: 10000000, chance: 0.09 },
        { name: 'Jackpot', value: 1000000000000, chance: 0.01 },
    ];

    // Save game data in localStorage on changes
    useEffect(() => {
        localStorage.setItem("money", money);
        localStorage.setItem("moneyPerClick", moneyPerClick);
        localStorage.setItem("autoEarnings", autoEarnings);
        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("rebirthCount", prestigeCount);
        localStorage.setItem("prestigeMultiplier", prestigeMultiplier);
        localStorage.setItem("prestigeCost", prestigeCost);
    }, [money, moneyPerClick, autoEarnings, prestigePoints, prestigeCount, prestigeMultiplier, prestigeCost]);

    // Increment playtime every second
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // 1-hour reminder
    useEffect(() => {
        if (playTime >= 3600) {
            setShowPopup(true);
        }
    }, [playTime]);

    // Click handler to earn money
    const handleClick = () => {
        setMoney(prev => prev + (moneyPerClick * prestigeMultiplier));
    };

    // Purchase upgrade, double its price after purchase
    const buyUpgrade = (cost, increase, upgradeName) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setMoneyPerClick(prev => prev + increase);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Purchase auto-earning upgrade
    const buyAutoEarnings = (cost, increase) => {
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setAutoEarnings(prev => prev + increase);
            return cost * 2; // Return new cost (doubled)
        }
        return cost;
    };

    // Casino function: Open a menu with two buttons for red or blue
    const openCasino = () => {
        setCasinoOpen(true);
        setCasinoOutcome("");
        setBetColor("");
        setWheelSpin(false);
    };

    // Spin the wheel and determine the outcome
    const spinWheel = (color) => {
        if (money > 0) {
            setBetColor(color);
            setWheelSpin(true); // Start spinning animation

            const outcome = Math.random() < 0.5 ? "red" : "blue";
            setTimeout(() => {
                if (outcome === color) {
                    setMoney(prev => prev * 2); // Double the money
                    setCasinoOutcome(`The wheel landed on ${outcome}! You won and doubled your money!`);
                } else {
                    setMoney(0); // Lose all money
                    setCasinoOutcome(`The wheel landed on ${outcome}. You lost all your money.`);
                }
                setShowPopup(true); // Show win/loss popup
                setCasinoOpen(false); // Close the casino after result
                setWheelSpin(false); // Stop spinning
            }, 3000); // Simulate spin delay
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
            setPrestigeCount(prev => prev + 1); // Increment prestige count
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

    // Test your luck feature
    const testYourLuck = () => {
        if (money > 0) {
            setLuckOpen(true);
             setMoney(0);
          
            const rand = Math.random();
            let selectedPrize = null;

            for (let prize of prizePool) {
                if (rand <= prize.chance) {
                    selectedPrize = prize;
                    break;
                }
            }

            setPrize(selectedPrize ? selectedPrize : { name: 'Nothing', value: 0 });
        }
    };

      const spendAllMoneyOnUpgrades = () => {
        let cost = 50;
        let increase = 2;
        let moneyLeft = money;
        let upgradesBought = 0;

        // Purchase upgrades while the user has enough money
        while (moneyLeft >= cost) {
            upgradesBought++;
            moneyLeft -= cost;
        }

        if (upgradesBought > 0) {
            setMoney(moneyLeft); // Update money after purchases
            setMoneyPerClick(prev => prev + upgradesBought * increase); // Increase money per click
        }
    };
    // Double or nothing feature
    const doubleOrNothing = () => {
        const rand = Math.random();
        if (rand < 0.05) { // 5% chance to win double
            setMoney(prev => prev + prize.value * 2); // Win double
            setCasinoOutcome(`You won double! Prize value: $${prize.value * 2}`);
        } else {
            setCasinoOutcome(`You lost it all!`);
            setMoney(0); // Lose everything
        }
        setLuckOpen(false); // Close luck mode
        setShowPopup(true); // Show popup for result
    };

const formatNumber = (num) => {
    if (num >= 1_000_000_000_000_000) {
        return `${(num / 1_000_000_000_000_000).toFixed(2)}Q (${num.toLocaleString()})`; // Quadrillions
    } else if (num >= 1_000_000_000_000) {
        return `${(num / 1_000_000_000_000).toFixed(2)}T (${num.toLocaleString()})`; // Trillions
    } else if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(2)}B (${num.toLocaleString()})`; // Billions
    } else if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M (${num.toLocaleString()})`; // Millions
    }
    return num.toLocaleString(); // Show full number for anything below a million
};

    
    return (
        <div className="App">
        <p>Total playtime: {Math.floor(playTime / 3600)} hours {Math.floor(playTime % 3600 / 60)} minutes</p>
            <h1 className="title">Moula Moula [BETA]</h1>
       <h2 className="money">Money: ${formatNumber(money)}</h2>
<h3>Money Per Click: ${formatNumber(moneyPerClick * prestigeMultiplier)}</h3>
<h3>Auto Earnings: ${formatNumber(autoEarnings * prestigeMultiplier)}/sec</h3>
<h3>Prestige Points: {prestigePoints}</h3>
<h3>Prestige Multiplier: x{prestigeMultiplier}</h3>
<h3>Prestige Count: {prestigeCount}</h3>
<h3>Prestige Cost: ${formatNumber(prestigeCost)}</h3>


            <div className="button-container">
                {!upgradePage && !casinoOpen && !luckOpen ? (
                    <>
                     {casinoOutcome && <p className="casino-outcome">{casinoOutcome}</p>}
                        <button onClick={handleClick} className="main-button">Click to Earn Money</button>
                        <button onClick={() => buyUpgrade(50, 2, 'Basic Upgrade')} disabled={money < 50} className="upgrade-button">Buy Upgrade (+$2 per click) (Cost: $50)</button>
                        <button onClick={() => buyUpgrade(5000, 100, 'Basic Upgrade')} disabled={money < 5000} className="upgrade-button">Buy Upgrade (+$100 per click) (Cost: $5000)</button>
                        <button onClick={() => buyAutoEarnings(100, 1)} disabled={money < 100} className="upgrade-button">Buy Auto-Earnings (+$1/sec) (Cost: $100)</button>
         <button onClick={() => buyAutoEarnings(10000, 100)} disabled={money < 10000} className="upgrade-button">Buy Auto-Earnings (+$100/sec) (Cost: $10000)</button>
                        <button onClick={openCasino} className="casino-button">Open Blind Betting (Casino)</button>
                        <button onClick={testYourLuck} className="luck-button">Test Your Luck (For all your Money)</button>
                        <button onClick={prestige} disabled={money < prestigeCost} className="prestige-button">Prestige (Cost: ${prestigeCost})</button>
                        <button onClick={() => setUpgradePage(true)} className="upgrade-page-button">Go to Upgrades Page</button>
 <button onClick={spendAllMoneyOnUpgrades}>Spend All Money on +2 Upgrades</button>
     <p>Game by: @xlnk</p>
                       
                    </>
                ) : upgradePage ? (
                    <>
                        <button onClick={() => setUpgradePage(false)} className="back-button">Back to Main Game</button>
                        <h2>Upgrades</h2>
                        <button onClick={() => buyUpgrade(100, 5, 'New House')} disabled={money < 100} className="upgrade-button">Buy New House (Cost: $100)</button>
                        <button onClick={() => buyUpgrade(200, 10, 'Machine')} disabled={money < 200} className="upgrade-button">Buy Machine (Cost: $200)</button>
                        <button onClick={() => buyUpgrade(500, 20, 'Food Production')} disabled={money < 500} className="upgrade-button">Buy Food Production (Cost: $500)</button>
                                           <button onClick={() => buyUpgrade(50000, 1000, 'Basic Upgrade')} disabled={money < 50000} className="upgrade-button">Buy Upgrade (+$1000 per click) (Cost: $50000)</button>
                               <button onClick={() => buyAutoEarnings(100000, 1000)} disabled={money < 100000} className="upgrade-button">Buy Auto-Earnings (+$1000/sec) (Cost: $100000)</button>
                    </>
                ) : casinoOpen ? (
                    <>
                        <h2>Blind Betting - Choose Your Color</h2>
                        <div className="wheel">
                            <div className={`spinner ${wheelSpin ? 'spinning' : ''}`}></div>
                        </div>
                        <button onClick={() => spinWheel('red')} className="casino-button">Bet on Red</button>
                        <button onClick={() => spinWheel('blue')} className="casino-button">Bet on Blue</button>
                        <button onClick={() => setCasinoOpen(false)} className="back-button">Back to Main Game</button>
                    </>
                ) : luckOpen ? (
                    <> <button onClick={() => setLuckOpen(false)} className="back-button">Back to Main Game</button>
                    <h2> Test Your Luck! </h2>
                        <h2>You won: {prize?.name || 'Nothing'} worth ${prize?.value || 0}!</h2>
                        <button onClick={() => setMoney(prize?.value)} className="casino-button">Cash Out</button>
                        <button onClick={doubleOrNothing} className="casino-button">Double or Nothing</button>
                   
                    </>
                ) : null}
            </div>

            {showPopup && (
                <div className="popup">
                    <h2>{casinoOutcome || 'Hello, Just Making Sure You are There!'}</h2>
                    <button onClick={() => setShowPopup(false)}>OK</button>
                </div>
            )}

           
        </div>
    );
};

export default App;
