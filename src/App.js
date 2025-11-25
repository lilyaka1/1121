import React, { useState, useEffect, useRef } from 'react';

function formatTime(sec) {
	sec = Math.max(0, Math.floor(sec));
	const mm = String(Math.floor(sec / 60)).padStart(2, '0');
	const ss = String(sec % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}

export default function App() {
	const [input, setInput] = useState('60');
	const [remaining, setRemaining] = useState(0);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef(null);

	useEffect(() => {
		if (running) {
			// Таймер запускается: каждую секунду уменьшаем оставшееся время
			intervalRef.current = setInterval(() => {
				setRemaining(prev => {
					if (prev <= 1) {
						// Таймер завершён: останавливаем, показываем alert
						clearInterval(intervalRef.current);
						setRunning(false);
						try { window.alert('Время вышло!'); } catch (e) {}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		// Очищаем таймер при остановке/размонтировании
		return () => clearInterval(intervalRef.current);
	}, [running]);

	function start() {
		// При нажатии "Старт": устанавливаем время, запускаем таймер
		const sec = Math.max(0, Number(input) || 0);
		if (remaining === 0) {
			setRemaining(sec);
		}
		if (sec === 0 && remaining === 0) return;
		setRunning(true);
	}

	function pause() {
		// При нажатии "Пауза": останавливаем таймер
		setRunning(false);
		clearInterval(intervalRef.current);
	}

	function reset() {
		// При нажатии "Сброс": сбрасываем таймер
		setRunning(false);
		clearInterval(intervalRef.current);
		setRemaining(0);
	}

	return (
		<div style={{ fontFamily: 'sans-serif', maxWidth: 420, margin: '24px auto', textAlign: 'center' }}>
			<h2>Таймер обратного отсчёта</h2>
			<div style={{ fontSize: 56, margin: '12px 0' }}>{formatTime(remaining)}</div>

			<div>
				<input
					type="number"
					min="0"
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => { if (e.key === 'Enter') start(); }}
					style={{ width: 120, padding: 6, fontSize: 16 }}
				/> сек
			</div>

			<div style={{ marginTop: 12 }}>
				<button onClick={start} disabled={running} style={{ padding: '8px 12px' }}>Старт</button>
				<button onClick={pause} style={{ marginLeft: 8, padding: '8px 12px' }}>Пауза</button>
				<button onClick={reset} style={{ marginLeft: 8, padding: '8px 12px' }}>Сброс</button>
			</div>
		</div>
	);
}
