import React, { useState } from 'react';
import {
    LayoutDashboard, ShoppingBag, Package, Database, Menu, LogOut,
    ChevronRight, Home, MapPin
} from 'lucide-react';
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminStores from './AdminStores'; // Import
import DataCentre from './DataCentre';
import type { Order, Product, OrderStatus, Store } from '../../types';

interface AdminDashboardProps {
    orders: Order[];
    products: Product[];
    stores: Store[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    deleteOrder: (orderId: string) => void;
    onUpdateStock: (productId: string, variantId: string, newStock: number) => void;
    onAddStore: (store: Store) => void; // New prop
    onDeleteStore: (id: string) => void; // New prop
    onLogout: () => void;
    onNavigateHome: () => void;
}

type AdminView = 'OVERVIEW' | 'ORDERS' | 'PRODUCTS' | 'DATA' | 'STORES';

const NavItem = ({ view, icon: Icon, label, currentView, onClick }: { view: AdminView; icon: any; label: string; currentView: AdminView; onClick: (view: AdminView) => void }) => (
    <button
        onClick={() => onClick(view)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${currentView === view
            ? 'bg-amber-100 text-orange-900 shadow-sm'
            : 'text-stone-500 hover:bg-stone-50 hover:text-orange-800'
            } `}
    >
        <Icon size={20} />
        <span>{label}</span>
        {currentView === view && <ChevronRight size={16} className="ml-auto" />}
    </button>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    orders,
    products,
    stores,
    updateOrderStatus,
    deleteOrder,
    onUpdateStock,
    onAddStore,
    onDeleteStore,
    onLogout,
    onNavigateHome
}) => {
    const [currentView, setCurrentView] = useState<AdminView>('OVERVIEW');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNavClick = (view: AdminView) => {
        setCurrentView(view);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-stone-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <span className="font-black text-xl">B</span>
                        </div>
                        <div>
                            <h1 className="font-black text-xl text-orange-950 leading-none">Admin Panel</h1>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Baba Ji Achar</p>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-grow">
                        <NavItem view="OVERVIEW" icon={LayoutDashboard} label="Overview" currentView={currentView} onClick={handleNavClick} />
                        <NavItem view="ORDERS" icon={ShoppingBag} label="Orders" currentView={currentView} onClick={handleNavClick} />
                        <NavItem view="PRODUCTS" icon={Package} label="Products" currentView={currentView} onClick={handleNavClick} />
                        <NavItem view="STORES" icon={MapPin} label="Stores" currentView={currentView} onClick={handleNavClick} />
                        <NavItem view="DATA" icon={Database} label="Data Centre" currentView={currentView} onClick={handleNavClick} />
                    </nav>

                    <div className="pt-6 border-t border-stone-100 space-y-2">
                        <button
                            onClick={onNavigateHome}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-orange-800 transition-colors font-bold"
                        >
                            <Home size={20} />
                            <span>Back to Store</span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Top Header (Mobile Only) */}
                <header className="lg:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleSidebar} className="p-2 text-stone-600 hover:bg-stone-50 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <span className="font-black text-lg text-orange-950">
                            {currentView === 'DATA' ? 'Data Centre' :
                                currentView.charAt(0) + currentView.slice(1).toLowerCase()}
                        </span>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm">
                        A
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {currentView === 'OVERVIEW' && <AdminOverview orders={orders} products={products} />}
                        {currentView === 'ORDERS' && <AdminOrders orders={orders} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />}
                        {currentView === 'PRODUCTS' && <AdminProducts products={products} onUpdateStock={onUpdateStock} />}
                        {currentView === 'STORES' && <AdminStores stores={stores} onAddStore={onAddStore} onDeleteStore={onDeleteStore} />}
                        {currentView === 'DATA' && <DataCentre orders={orders} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
