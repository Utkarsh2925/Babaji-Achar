import React from 'react';
import { Download, FileSpreadsheet, Shield, Package, MapPin } from 'lucide-react';
import type { Order, Product, Store } from '../../types';
import { CSVExport } from '../../utils/CSVExport';

interface DataCentreProps {
    orders: Order[];
    products: Product[];
    stores: Store[];
}

const DataCentre: React.FC<DataCentreProps> = ({ orders, products, stores }) => {

    const downloadAllData = () => {
        CSVExport.exportAll(orders, products, stores);
    };

    const downloadOrders = () => {
        CSVExport.exportOrders(orders);
    };

    const downloadProducts = () => {
        CSVExport.exportProducts(products);
    };

    const downloadStores = () => {
        CSVExport.exportStores(stores);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="text-center space-y-4 mb-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <DatabaseIcon size={40} />
                </div>
                <h2 className="text-4xl font-black text-stone-900">Data Centre</h2>
                <p className="text-xl text-stone-500 font-medium max-w-lg mx-auto">
                    Securely access and download your business data. This includes all customer details, order history, and financial records.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export All Data */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all md:col-span-2">
                    <FileSpreadsheet size={48} className="mb-6" />
                    <h3 className="text-3xl font-black mb-2">Complete Data Export</h3>
                    <p className="text-blue-100 font-medium mb-8">
                        Download all orders, products, and stores data in separate CSV files
                    </p>
                    <button
                        onClick={downloadAllData}
                        className="w-full bg-white text-blue-700 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Download size={24} />
                        Export All Data (3 Files)
                    </button>
                </div>

                {/* Orders Export */}
                <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-stone-900">Orders Data</h4>
                            <p className="text-sm text-stone-500 font-medium">{orders.length} records</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadOrders}
                        className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Export Orders
                    </button>
                </div>

                {/* Products Export */}
                <div className="bg-white p-6 rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-stone-900">Products Data</h4>
                            <p className="text-sm text-stone-500 font-medium">{products.length} products</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadProducts}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Export Products
                    </button>
                </div>

                {/* Stores Export */}
                <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-stone-900">Stores Data</h4>
                            <p className="text-sm text-stone-500 font-medium">{stores.length} locations</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadStores}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Export Stores
                    </button>
                </div>

                {/* Security Info */}
                <div className="bg-stone-900 p-8 rounded-3xl text-stone-300 flex flex-col justify-center">
                    <Shield size={48} className="text-green-500 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4">Secure & Private</h3>
                    <p className="font-medium opacity-80 mb-6 leading-relaxed">
                        This data contains sensitive customer information. Please handle it with care and do not share it with unauthorized personnel.
                    </p>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white">Total Records</span>
                            <span className="font-bold text-green-400">{orders.length}</span>
                        </div>
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DatabaseIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path>
    </svg>
);

export default DataCentre;
