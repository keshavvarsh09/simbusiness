'use client';

import { useState, useEffect } from 'react';
import {
    FiPackage, FiTruck, FiMapPin, FiClock, FiCheckCircle,
    FiAlertTriangle, FiRefreshCw, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type ShipmentStatus = 'processing' | 'shipped' | 'in_transit' | 'customs' | 'delivered' | 'delayed' | 'lost';

interface Shipment {
    id: string;
    orderId: string;
    productName: string;
    status: ShipmentStatus;
    shippingMethod: 'standard' | 'express' | 'epacket';
    origin: string;
    destination: string;
    estimatedDays: number;
    actualDays: number;
    trackingEvents: TrackingEvent[];
    createdAt: Date;
    deliveredAt?: Date;
    hasIssue: boolean;
    issueType?: 'delay' | 'customs_hold' | 'lost' | 'damaged';
}

interface TrackingEvent {
    date: Date;
    location: string;
    status: string;
    description: string;
}

interface LogisticsStats {
    totalShipments: number;
    inTransit: number;
    delivered: number;
    delayed: number;
    averageDeliveryDays: number;
    onTimeRate: number;
}

interface LogisticsTrackerProps {
    orders?: number;
    onIssue?: (issue: string) => void;
}

export default function LogisticsTracker({ orders = 0, onIssue }: LogisticsTrackerProps) {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [stats, setStats] = useState<LogisticsStats>({
        totalShipments: 0,
        inTransit: 0,
        delivered: 0,
        delayed: 0,
        averageDeliveryDays: 0,
        onTimeRate: 100
    });
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [simulating, setSimulating] = useState(false);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        productName: 'Sample Product',
        shippingMethod: 'standard' as 'standard' | 'express' | 'epacket',
        destination: 'New York, USA'
    });

    const shippingMethods = {
        standard: { name: 'Standard', minDays: 15, maxDays: 30, cost: 3 },
        express: { name: 'Express', minDays: 5, maxDays: 12, cost: 12 },
        epacket: { name: 'ePacket', minDays: 10, maxDays: 20, cost: 5 }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (simulating) {
            interval = setInterval(() => {
                simulateShipments();
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [simulating, shipments]);

    useEffect(() => {
        calculateStats();
    }, [shipments]);

    const simulateShipments = () => {
        const updatedShipments = shipments.map(shipment => {
            if (shipment.status === 'delivered' || shipment.status === 'lost') {
                return shipment;
            }

            const newActualDays = shipment.actualDays + 1;
            let newStatus: ShipmentStatus = shipment.status;
            let newHasIssue = shipment.hasIssue;
            let newIssueType = shipment.issueType;
            const newEvents = [...shipment.trackingEvents];

            if (shipment.status === 'processing' && newActualDays >= 2) {
                newStatus = 'shipped';
                newEvents.push({
                    date: new Date(),
                    location: shipment.origin,
                    status: 'Shipped',
                    description: 'Package has left the warehouse'
                });
            } else if (shipment.status === 'shipped' && newActualDays >= 4) {
                newStatus = 'in_transit';
                newEvents.push({
                    date: new Date(),
                    location: 'International Hub',
                    status: 'In Transit',
                    description: 'Package in transit to destination country'
                });
            } else if (shipment.status === 'in_transit' && newActualDays >= 8) {
                if (Math.random() < 0.15 && !shipment.hasIssue) {
                    newStatus = 'customs';
                    newHasIssue = true;
                    newIssueType = 'customs_hold';
                    newEvents.push({
                        date: new Date(),
                        location: 'Customs',
                        status: 'Held at Customs',
                        description: 'Package is being inspected by customs'
                    });
                    if (onIssue) onIssue('Shipment held at customs');
                } else if (newActualDays >= shipment.estimatedDays) {
                    newStatus = 'delivered';
                    newEvents.push({
                        date: new Date(),
                        location: shipment.destination,
                        status: 'Delivered',
                        description: 'Package delivered successfully'
                    });
                }
            } else if (shipment.status === 'customs' && newActualDays >= 12) {
                newStatus = 'in_transit';
                newEvents.push({
                    date: new Date(),
                    location: 'Customs',
                    status: 'Released',
                    description: 'Package cleared customs, continuing delivery'
                });
            }

            if (!newHasIssue && Math.random() < 0.05) {
                newHasIssue = true;
                newIssueType = 'delay';
                newEvents.push({
                    date: new Date(),
                    location: 'In Transit',
                    status: 'Delayed',
                    description: 'Package delayed due to logistics issues'
                });
                if (onIssue) onIssue('Shipment delayed');
            }

            if (!newHasIssue && Math.random() < 0.01) {
                newStatus = 'lost';
                newHasIssue = true;
                newIssueType = 'lost';
                newEvents.push({
                    date: new Date(),
                    location: 'Unknown',
                    status: 'Lost',
                    description: 'Package cannot be located'
                });
                if (onIssue) onIssue('Package lost! Customer refund required');
            }

            if (newActualDays > shipment.estimatedDays && newStatus !== 'delivered' && !newHasIssue) {
                newHasIssue = true;
                newIssueType = 'delay';
            }

            return {
                ...shipment,
                actualDays: newActualDays,
                status: newStatus,
                hasIssue: newHasIssue,
                issueType: newIssueType,
                trackingEvents: newEvents,
                deliveredAt: newStatus === 'delivered' ? new Date() : undefined
            };
        });

        setShipments(updatedShipments);
    };

    const calculateStats = () => {
        const total = shipments.length;
        const inTransit = shipments.filter(s =>
            ['processing', 'shipped', 'in_transit', 'customs'].includes(s.status)
        ).length;
        const delivered = shipments.filter(s => s.status === 'delivered').length;
        const delayed = shipments.filter(s => s.hasIssue).length;

        const deliveredShipments = shipments.filter(s => s.status === 'delivered');
        const avgDays = deliveredShipments.length > 0
            ? deliveredShipments.reduce((sum, s) => sum + s.actualDays, 0) / deliveredShipments.length
            : 0;

        const onTime = deliveredShipments.filter(s => s.actualDays <= s.estimatedDays).length;
        const onTimeRate = deliveredShipments.length > 0
            ? (onTime / deliveredShipments.length) * 100
            : 100;

        setStats({
            totalShipments: total,
            inTransit,
            delivered,
            delayed,
            averageDeliveryDays: avgDays,
            onTimeRate
        });
    };

    const createShipment = () => {
        const method = shippingMethods[newOrder.shippingMethod];
        const estimatedDays = Math.floor(
            method.minDays + Math.random() * (method.maxDays - method.minDays)
        );

        const shipment: Shipment = {
            id: `SHP-${Date.now()}`,
            orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
            productName: newOrder.productName,
            status: 'processing',
            shippingMethod: newOrder.shippingMethod,
            origin: 'Shenzhen, China',
            destination: newOrder.destination,
            estimatedDays,
            actualDays: 0,
            trackingEvents: [{
                date: new Date(),
                location: 'Shenzhen, China',
                status: 'Order Received',
                description: 'Order received and processing started'
            }],
            createdAt: new Date(),
            hasIssue: false
        };

        setShipments([shipment, ...shipments]);
        setShowNewOrderModal(false);
        setNewOrder({ productName: 'Sample Product', shippingMethod: 'standard', destination: 'New York, USA' });
    };

    const getStatusColor = (status: ShipmentStatus) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-500/10';
            case 'in_transit': return 'text-blue-600 bg-blue-500/10';
            case 'shipped': return 'text-purple-600 bg-purple-500/10';
            case 'processing': return 'text-yellow-600 bg-yellow-500/10';
            case 'customs': return 'text-orange-600 bg-orange-500/10';
            case 'delayed': return 'text-red-600 bg-red-500/10';
            case 'lost': return 'text-red-600 bg-red-500/10';
            default: return 'text-gray-600 bg-gray-500/10';
        }
    };

    return (
        <div className="bg-surface-primary rounded-2xl border border-border-primary shadow-card overflow-hidden">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <FiTruck className="text-blue-500" />
                            Logistics Tracker
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Monitor shipments and delivery performance
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewOrderModal(true)}
                            className="px-3 py-1.5 bg-accent-primary text-white rounded-lg text-sm hover:bg-accent-primary/90 transition-all"
                        >
                            + New Shipment
                        </button>
                        <button
                            onClick={() => setSimulating(!simulating)}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${simulating
                                    ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                                    : 'bg-green-500/10 text-green-600 border border-green-500/30'
                                }`}
                        >
                            {simulating ? <FiX className="w-4 h-4" /> : <FiRefreshCw className="w-4 h-4" />}
                            {simulating ? 'Stop' : 'Simulate'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-text-primary">{stats.totalShipments}</div>
                        <div className="text-xs text-text-secondary">Total</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{stats.inTransit}</div>
                        <div className="text-xs text-text-secondary">In Transit</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">{stats.delivered}</div>
                        <div className="text-xs text-text-secondary">Delivered</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-red-600">{stats.delayed}</div>
                        <div className="text-xs text-text-secondary">Issues</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">{stats.onTimeRate.toFixed(0)}%</div>
                        <div className="text-xs text-text-secondary">On-Time</div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
                {shipments.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                        <FiPackage className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No shipments yet</p>
                        <p className="text-sm mt-1">Create a shipment to start tracking</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {shipments.slice(0, 10).map(shipment => (
                            <motion.div
                                key={shipment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-background ${shipment.hasIssue ? 'border-red-500/30 bg-red-500/5' : 'border-border-primary bg-background'
                                    }`}
                                onClick={() => setSelectedShipment(shipment)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-medium text-text-primary flex items-center gap-2">
                                            {shipment.productName}
                                            {shipment.hasIssue && (
                                                <FiAlertTriangle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <div className="text-xs text-text-secondary">{shipment.id}</div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(shipment.status)}`}>
                                        {shipment.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="text-text-secondary">
                                        <FiMapPin className="inline w-3 h-3 mr-1" />
                                        {shipment.origin} → {shipment.destination}
                                    </div>
                                    <div className="text-text-secondary">
                                        <FiClock className="inline w-3 h-3 mr-1" />
                                        Day {shipment.actualDays} / {shipment.estimatedDays}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedShipment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface-primary rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">{selectedShipment.productName}</h3>
                                    <p className="text-sm text-text-secondary">{selectedShipment.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedShipment(null)}
                                    className="p-2 hover:bg-background rounded-lg transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Status</span>
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(selectedShipment.status)}`}>
                                        {selectedShipment.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="p-3 bg-background rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FiMapPin className="text-text-secondary" />
                                        <span className="text-text-primary">{selectedShipment.origin}</span>
                                        <span className="text-text-secondary">→</span>
                                        <span className="text-text-primary">{selectedShipment.destination}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Shipping Method</span>
                                    <span className="font-medium">{shippingMethods[selectedShipment.shippingMethod].name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Estimated Delivery</span>
                                    <span className="font-medium">{selectedShipment.estimatedDays} days</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Current Day</span>
                                    <span className={`font-medium ${selectedShipment.actualDays > selectedShipment.estimatedDays ? 'text-red-600' : 'text-green-600'}`}>
                                        Day {selectedShipment.actualDays}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-medium text-text-primary mb-3">Tracking History</h4>
                                    <div className="space-y-3">
                                        {selectedShipment.trackingEvents.map((event, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${index === selectedShipment.trackingEvents.length - 1
                                                            ? 'bg-accent-primary'
                                                            : 'bg-gray-300'
                                                        }`} />
                                                    {index < selectedShipment.trackingEvents.length - 1 && (
                                                        <div className="w-0.5 h-8 bg-gray-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-3">
                                                    <div className="font-medium text-sm text-text-primary">{event.status}</div>
                                                    <div className="text-xs text-text-secondary">{event.location}</div>
                                                    <div className="text-xs text-text-secondary mt-1">{event.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {showNewOrderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-primary rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Create Shipment</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={newOrder.productName}
                                    onChange={e => setNewOrder({ ...newOrder, productName: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Shipping Method</label>
                                <select
                                    value={newOrder.shippingMethod}
                                    onChange={e => setNewOrder({ ...newOrder, shippingMethod: e.target.value as 'standard' | 'express' | 'epacket' })}
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                >
                                    <option value="standard">Standard (15-30 days, $3)</option>
                                    <option value="epacket">ePacket (10-20 days, $5)</option>
                                    <option value="express">Express (5-12 days, $12)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Destination</label>
                                <input
                                    type="text"
                                    value={newOrder.destination}
                                    onChange={e => setNewOrder({ ...newOrder, destination: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowNewOrderModal(false)}
                                className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-background"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createShipment}
                                className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
                            >
                                Create Shipment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
