import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- Helper Components ---

const Header = () => (
    <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800">Bank Statement Spends Analysis (React)</h1>
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

const ChartControls = ({ scale, onScaleChange, maxSpend, chartType, onChartTypeChange, dateRange, onDateRangeChange, originalData }) => {
    const minDate = originalData.length > 0 ? originalData[0].Date.split('-').reverse().join('-') : '';
    const maxDate = originalData.length > 0 ? originalData[originalData.length - 1].Date.split('-').reverse().join('-') : '';

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Type Toggle */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Chart Type</h4>
                    <div className="flex gap-2">
                        <button onClick={() => onChartTypeChange('bar')} className={`px-4 py-2 text-sm rounded-full font-semibold ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Bar</button>
                        <button onClick={() => onChartTypeChange('line')} className={`px-4 py-2 text-sm rounded-full font-semibold ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Line</button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Date Range</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                         <input type="date" name="start" value={dateRange.start} min={minDate} max={maxDate} onChange={onDateRangeChange} className="w-full p-2 rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                         <input type="date" name="end" value={dateRange.end} min={minDate} max={maxDate} onChange={onDateRangeChange} className="w-full p-2 rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                    </div>
                </div>

                {/* Sliders */}
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Adjust Y-Axis Scale</h4>
                    <div>
                        <label htmlFor="yMin" className="block text-sm font-medium text-gray-700 mb-2">
                            Min Value: <span className="font-bold text-blue-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(scale.min)}</span>
                        </label>
                        <input type="range" id="yMin" name="min" min="0" max={maxSpend} value={scale.min} onChange={onScaleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="yMax" className="block text-sm font-medium text-gray-700 mb-2">
                           Max Value: <span className="font-bold text-blue-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(scale.max)}</span>
                        </label>
                        <input type="range" id="yMax" name="max" min="0" max={maxSpend} value={scale.max} onChange={onScaleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SpendsChart = ({ data, scale, chartType }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const BAR_COLOR = '#3b82f6';
    const LINE_COLOR = '#ef4444';

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        const dates = data.map(d => d.Date);
        const spends = data.map(d => d.DailySpends);

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: dates,
                datasets: [{
                    label: 'Withdrawals / Spends (INR)',
                    data: spends,
                    backgroundColor: chartType === 'bar' ? BAR_COLOR : 'transparent',
                    borderColor: chartType === 'line' ? LINE_COLOR : BAR_COLOR,
                    borderWidth: chartType === 'line' ? 2 : 1,
                    borderRadius: chartType === 'bar' ? 8 : 0,
                    pointBackgroundColor: chartType === 'line' ? LINE_COLOR : undefined,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Spend: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: { min: scale.min, max: scale.max, title: { display: true, text: 'Spends (INR)' } },
                    x: { title: { display: true, text: 'Date' } }
                }
            }
        });

        return () => chartInstanceRef.current?.destroy();
    }, [data, scale, chartType]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Spends Visualization</h2>
            <div className="h-96">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

const Statistics = ({ data }) => {
    if (!data || data.length === 0) return null;

    const totalSpend = data.reduce((sum, item) => sum + item.DailySpends, 0);
    const averageSpend = totalSpend / data.length;
    const highestSpend = data.reduce((max, item) => item.DailySpends > max.DailySpends ? item : max, data[0]);

    const StatCard = ({ title, value }) => (
        <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-semibold">{title}</p>
            <p className="text-xl font-bold text-blue-900">{value}</p>
        </div>
    );
    
    return (
         <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Key Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Spend" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpend)} />
                <StatCard title="Average Daily Spend" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(averageSpend)} />
                <StatCard title="Highest Spend Day" value={`${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(highestSpend.DailySpends)} on ${highestSpend.Date}`} />
            </div>
        </div>
    );
};

const SpendsTable = ({ data, onSort, sortConfig, onExport }) => {
    if (!data || data.length === 0) return null;
    const totalSpend = data.reduce((sum, item) => sum + item.DailySpends, 0);

    const SortIcon = ({ direction }) => (
        <span className="ml-2">{direction === 'ascending' ? '▲' : '▼'}</span>
    );
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Daily Spends Data</h2>
                 <button onClick={onExport} className="px-4 py-2 text-sm rounded-full font-semibold bg-green-600 text-white hover:bg-green-700">Export CSV</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => onSort('Date')}>
                                Date {sortConfig.key === 'Date' && <SortIcon direction={sortConfig.direction} />}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => onSort('DailySpends')}>
                                Daily Spends (INR) {sortConfig.key === 'DailySpends' && <SortIcon direction={sortConfig.direction} />}
                            </th>
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
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLibraryReady, setIsLibraryReady] = useState(false);
    const [yScale, setYScale] = useState({ min: 0, max: 1000 });
    const [maxSpendValue, setMaxSpendValue] = useState(1000);
    const [chartType, setChartType] = useState('bar');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortConfig, setSortConfig] = useState({ key: 'Date', direction: 'ascending' });

    useEffect(() => {
        if (window.XLSX) { setIsLibraryReady(true); return; }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.async = true;
        script.onload = () => setIsLibraryReady(true);
        script.onerror = () => setError("Failed to load spreadsheet library.");
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);
    
    useEffect(() => {
        let data = [...originalData];
        if (dateRange.start) data = data.filter(d => new Date(d.Date.split('-').reverse().join('-')) >= new Date(dateRange.start));
        if (dateRange.end) data = data.filter(d => new Date(d.Date.split('-').reverse().join('-')) <= new Date(dateRange.end));
        
        data.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            if (sortConfig.key === 'Date') {
                aValue = new Date(aValue.split('-').reverse().join('-'));
                bValue = new Date(bValue.split('-').reverse().join('-'));
            }
            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setFilteredData(data);
    }, [originalData, dateRange, sortConfig]);

    const processSpreadsheetData = (data) => {
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        if (sheetData.length === 0) throw new Error("Spreadsheet empty.");
        let headerRowIndex = sheetData.findIndex(row => row && row.some(cell => typeof cell === 'string' && cell.trim() === 'Date'));
        if (headerRowIndex === -1) throw new Error("Could not find header row.");
        const headerRow = sheetData[headerRowIndex].map(h => typeof h === 'string' ? h.trim() : '');
        let transactions = window.XLSX.utils.sheet_to_json(worksheet, { header: headerRow, range: headerRowIndex + 1, raw: false });
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
            if (dateStr instanceof Date) { date = dateStr; }
            else {
                const parts = String(dateStr).split('/');
                if (parts.length !== 3) return;
                const [day, month, year] = parts;
                const fullYear = year.length === 2 ? `20${year}` : year;
                date = new Date(`${fullYear}-${month}-${day}`);
            }
            if (isNaN(date.getTime())) return;
            const formattedDateKey = date.toISOString().split('T')[0];
            dailySpendsMap[formattedDateKey] = (dailySpendsMap[formattedDateKey] || 0) + withdrawalAmt;
        });

        return Object.keys(dailySpendsMap).map(dateKey => ({
            Date: new Date(dateKey).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            DailySpends: dailySpendsMap[dateKey]
        })).sort((a, b) => new Date(a.Date.split('-').reverse().join('-')) - new Date(b.Date.split('-').reverse().join('-')));
    };

    const handleFileProcess = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setIsLoading(true);
        setError('');
        setOriginalData([]);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!window.XLSX) throw new Error("Spreadsheet library not available.");
                const data = new Uint8Array(e.target.result);
                const structuredData = processSpreadsheetData(data);
                if (structuredData.length === 0) throw new Error("No transaction records found.");
                const processedSpends = calculateDailySpends(structuredData);
                if (processedSpends.length === 0) throw new Error("No valid withdrawal transactions.");
                
                const maxSpend = Math.max(...processedSpends.map(d => d.DailySpends), 0);
                const roundedMax = Math.ceil(maxSpend / 100) * 100;
                
                setMaxSpendValue(roundedMax > 0 ? roundedMax : 1000);
                setYScale({ min: 0, max: roundedMax > 0 ? roundedMax : 1000 });
                setOriginalData(processedSpends);
                const firstDate = processedSpends[0].Date.split('-').reverse().join('-');
                const lastDate = processedSpends[processedSpends.length-1].Date.split('-').reverse().join('-');
                setDateRange({start: firstDate, end: lastDate});

            } catch (err) {
                setError(`Error: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => { setError('Error reading file.'); setIsLoading(false); };
        reader.readAsArrayBuffer(file);
    };
    
    const handleScaleChange = (event) => {
        const { name, value } = event.target;
        const numericValue = parseFloat(value);
        setYScale(prev => {
            if (name === 'min' && numericValue > prev.max) return { min: numericValue, max: numericValue };
            if (name === 'max' && numericValue < prev.min) return { min: numericValue, max: numericValue };
            return { ...prev, [name]: numericValue };
        });
    };
    
    const handleDateRangeChange = (event) => {
        const { name, value } = event.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const handleExport = () => {
        const header = ["Date", "DailySpends (INR)"];
        const rows = filteredData.map(row => [row.Date, row.DailySpends]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + [header, ...rows].map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "daily_spends_summary.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasResults = originalData.length > 0;

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <Header />
                <FileUploader onFileProcess={handleFileProcess} isLoading={isLoading} error={error} isReady={isLibraryReady} />
                
                {hasResults ? (
                    <div id="resultsContainer">
                        <Statistics data={filteredData} />
                        <ChartControls 
                            scale={yScale} 
                            onScaleChange={handleScaleChange} 
                            maxSpend={maxSpendValue}
                            chartType={chartType}
                            onChartTypeChange={setChartType}
                            dateRange={dateRange}
                            onDateRangeChange={handleDateRangeChange}
                            originalData={originalData}
                        />
                        <SpendsChart data={filteredData} scale={yScale} chartType={chartType} />
                        <SpendsTable data={filteredData} onSort={handleSort} sortConfig={sortConfig} onExport={handleExport} />
                    </div>
                ) : (
                    !isLoading && !error && (
                         <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                             <p className="text-gray-500 text-lg">Upload your bank statement to see your spending analysis.</p>
                         </div>
                    )
                )}
            </div>
        </div>
    );
}

