import React from 'react';
import { TrendingUp, ShoppingBag, AlertCircle, Package } from 'lucide-react';
import type { Order, Product } from '../../types';

interface AdminOverviewProps {
    orders: Order[];
    products: Product[];
}

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-stone-400 font-bold text-xs uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-black text-stone-900">{value}</h3>
            {subValue && <p className="text-sm text-stone-500 font-medium mt-2">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const AdminOverview: React.FC<AdminOverviewProps> = ({ orders, products }) => {
    // Calculate Stats
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending_Payment' || o.status === 'Payment_Received').length;
    const lowStockProducts = products.filter(p => p.variants.some(v => v.stock < 10)).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-orange-950 mb-2">Dashboard Overview</h2>
                <p className="text-stone-500 font-medium">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-green-500"
                    subValue="+12% from last month"
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                    subValue={`${pendingOrders} pending processing`}
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={lowStockProducts}
                    icon={AlertCircle}
                    color="bg-red-500"
                    subValue="Products needing restock"
                />
                <StatCard
                    title="Active Products"
                    value={products.length}
                    icon={Package}
                    color="bg-amber-500"
                    subValue="Live on store"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Preview */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-xl text-orange-950">Recent Orders</h3>
                        <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Last 5</span>
                    </div>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-orange-950 border border-orange-200 text-[10px] text-center px-1">
                                        {order.id.replace('Order ', '')}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900">{order.customerDetails.fullName}</h4>
                                        <p className="text-xs text-stone-500">{order.items.length} items • {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="font-black text-orange-700">₹{order.totalAmount}</span>
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-stone-400 font-bold text-center py-4">No recent orders</p>}
                    </div>
                </div>

                {/* Quick Actions (Placeholder for future) */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-black text-2xl mb-4">Grow Your Business</h3>
                        <p className="font-medium text-white/80 mb-8 max-w-sm">Check the Data Centre to download user insights and order history for analysis.</p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg font-bold text-sm">Marketing</div>
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg font-bold text-sm">Inventory</div>
                        </div>
                    </div>
                    <TrendingUp className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48" />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
