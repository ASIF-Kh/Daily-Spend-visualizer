import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- Helper Components ---

const Header = () => (
    <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800">Bank Statement Spends Analysis</h1>
        <p className="text-gray-600 mt-2">Upload your bank statement **CSV, XLS, or XLSX** file to visualize daily withdrawals.</p>
    </header>
);

const FileUploader = ({ onFileProcess, isLoading, error, isReady }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="spreadsheetFile">
            Upload Spreadsheet File (CSV, XLS, XLSX)
        </label>
        <input
            type="file"
            id="spreadsheetFile"
            accept=".csv, .xls, .xlsx"
            onChange={onFileProcess}
            disabled={!isReady || isLoading}
            className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {!isReady && !error && (
            <p className="mt-4 text-center text-gray-500 font-medium">
                Initializing spreadsheet library...
            </p>
        )}
        {isLoading && (
            <p className="mt-4 text-center text-blue-600 font-medium">
                Processing data... please wait.
            </p>
        )}
        {error && (
            <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
        )}
    </div>
);

const ChartControls = ({ scale, onScaleChange, maxSpend }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Adjust Chart Scale (Y-Axis)</h3>
        <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="yMin" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Value: <span className="font-bold text-blue-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(scale.min)}</span>
                </label>
                <input
                    type="range"
                    id="yMin"
                    name="min"
                    min="0"
                    max={maxSpend}
                    value={scale.min}
                    onChange={onScaleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label htmlFor="yMax" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Value: <span className="font-bold text-blue-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(scale.max)}</span>
                </label>
                <input
                    type="range"
                    id="yMax"
                    name="max"
                    min="0"
                    max={maxSpend}
                    value={scale.max}
                    onChange={onScaleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    </div>
);

const SpendsChart = ({ data, scale }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const CHART_COLOR = '#3b82f6'; // Tailwind blue-500

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        const dates = data.map(d => d.Date);
        const spends = data.map(d => d.DailySpends);

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Withdrawals / Spends (INR)',
                    data: spends,
                    backgroundColor: CHART_COLOR,
                    borderColor: CHART_COLOR,
                    borderWidth: 1,
                    borderRadius: 8,
                    hoverBackgroundColor: '#2563eb'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: scale.min,
                        max: scale.max,
                        title: { display: true, text: 'Spends (INR)' }
                    },
                    x: { title: { display: true, text: 'Date (DD-MM-YYYY)' } }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data, scale]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Spends Chart (INR)</h2>
            <div className="h-80">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

const SpendsTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const totalSpend = data.reduce((sum, item) => sum + item.DailySpends, 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Spends Data</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Spends (INR)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.Date}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.DailySpends)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">Total Spend</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpend)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
    const [dailySpends, setDailySpends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLibraryReady, setIsLibraryReady] = useState(false);
    const [yScale, setYScale] = useState({ min: 0, max: 1000 });
    const [maxSpendValue, setMaxSpendValue] = useState(1000);

    useEffect(() => {
        if (window.XLSX) {
            setIsLibraryReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.async = true;
        script.onload = () => setIsLibraryReady(true);
        script.onerror = () => {
            setError("Failed to load spreadsheet library. Please check your network and refresh.");
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const processSpreadsheetData = (data) => {
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        if (sheetData.length === 0) throw new Error("Spreadsheet appears empty.");
        
        let headerRowIndex = -1;
        let headerRow = [];
        for (let i = 0; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (row && row.some(cell => typeof cell === 'string' && cell.trim() === 'Date')) {
                headerRowIndex = i;
                headerRow = row.map(h => typeof h === 'string' ? h.trim() : '');
                break;
            }
        }

        if (headerRowIndex === -1) throw new Error("Could not find the header row (containing 'Date').");
        
        const jsonOptions = { header: headerRow, range: headerRowIndex + 1, raw: false };
        let transactions = window.XLSX.utils.sheet_to_json(worksheet, jsonOptions);
        
        return transactions.filter(t => t['Date'] && !String(t['Date']).includes('*'));
    };

    const calculateDailySpends = (data) => {
        const dailySpendsMap = {};
        data.forEach(row => {
            const dateStr = row['Date'];
            const withdrawalAmtStr = row['Withdrawal Amt.'];

            if (!dateStr || dateStr.includes('*')) return;
            let withdrawalAmt = parseFloat(String(withdrawalAmtStr).replace(/[^0-9.]/g, '') || 0);
            if (isNaN(withdrawalAmt) || withdrawalAmt <= 0) return;

            let date;
            if (dateStr instanceof Date) {
                date = dateStr;
            } else {
                const parts = String(dateStr).split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    date = new Date(`${fullYear}-${month}-${day}`);
                } else return;
            }

            if (isNaN(date.getTime())) return;
            const formattedDateKey = date.toISOString().split('T')[0];
            dailySpendsMap[formattedDateKey] = (dailySpendsMap[formattedDateKey] || 0) + withdrawalAmt;
        });

        return Object.keys(dailySpendsMap).map(dateKey => {
            const date = new Date(dateKey);
            return {
                Date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
                DailySpends: dailySpendsMap[dateKey]
            };
        }).sort((a, b) => new Date(a.Date.split('-').reverse().join('-')) - new Date(b.Date.split('-').reverse().join('-')));
    };

    const handleFileProcess = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setError('');
        setDailySpends([]);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!window.XLSX) {
                    throw new Error("Spreadsheet library (XLSX) is not available.");
                }
                const data = new Uint8Array(e.target.result);
                const structuredData = processSpreadsheetData(data);
                if (structuredData.length === 0) throw new Error("Could not parse transaction records.");

                const processedSpends = calculateDailySpends(structuredData);
                if (processedSpends.length === 0) throw new Error("No valid withdrawal/spend transactions found.");
                
                const maxSpend = Math.max(...processedSpends.map(d => d.DailySpends), 0);
                const roundedMax = Math.ceil(maxSpend / 100) * 100;
                
                setMaxSpendValue(roundedMax > 0 ? roundedMax : 1000);
                setYScale({ min: 0, max: roundedMax > 0 ? roundedMax : 1000 });
                setDailySpends(processedSpends);

            } catch (err) {
                console.error("Processing Error:", err);
                setError(`Error: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Error reading file. Please try again.');
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };
    
    const handleScaleChange = (event) => {
        const { name, value } = event.target;
        const numericValue = parseFloat(value);

        setYScale(prevScale => {
            if (name === 'min' && numericValue > prevScale.max) {
                return { min: numericValue, max: numericValue };
            }
            if (name === 'max' && numericValue < prevScale.min) {
                return { min: numericValue, max: numericValue };
            }
            return { ...prevScale, [name]: numericValue };
        });
    };

    const hasResults = dailySpends.length > 0;

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <Header />
                <FileUploader onFileProcess={handleFileProcess} isLoading={isLoading} error={error} isReady={isLibraryReady} />
                
                {hasResults ? (
                    <div id="resultsContainer">
                        <ChartControls scale={yScale} onScaleChange={handleScaleChange} maxSpend={maxSpendValue} />
                        <SpendsChart data={dailySpends} scale={yScale} />
                        <SpendsTable data={dailySpends} />
                    </div>
                ) : (
                    !isLoading && !error && (
                         <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                             <p className="text-gray-500 text-lg">Upload your bank statement to generate the daily spend report and chart.</p>
                         </div>
                    )
                )}
            </div>
        </div>
    );
}

