/**
 * Add Product Form Component
 * Allows users to manually add products to their catalog
 */

'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiCheckCircle, FiAlertCircle, FiPackage, FiDollarSign, FiShoppingBag, FiGlobe } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface AddProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    sellingPrice: '',
    moq: '',
    vendorName: '',
    vendorPlatform: '',
    sourceUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.cost || !formData.sellingPrice) {
      setError('Product name, cost, and selling price are required');
      return;
    }

    const cost = parseFloat(formData.cost);
    const sellingPrice = parseFloat(formData.sellingPrice);

    if (isNaN(cost) || isNaN(sellingPrice) || cost <= 0 || sellingPrice <= 0) {
      setError('Cost and selling price must be valid positive numbers');
      return;
    }

    if (sellingPrice <= cost) {
      setError('Selling price must be greater than cost');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          category: formData.category || 'General',
          estimatedCost: cost,
          sellingPrice: sellingPrice,
          moq: formData.moq ? parseInt(formData.moq) : 0,
          vendorName: formData.vendorName || null,
          vendorPlatform: formData.vendorPlatform || null,
          sourceUrl: formData.sourceUrl || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message if available
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to add product');
        throw new Error(errorMsg);
      }

      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        category: '',
        cost: '',
        sellingPrice: '',
        moq: '',
        vendorName: '',
        vendorPlatform: '',
        sourceUrl: ''
      });

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setIsOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <FiPlus /> Add Product
      </button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false);
              if (onCancel) onCancel();
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-apple-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-title-2 font-bold text-gray-900">Add New Product</h2>
                  <p className="text-body text-gray-500">Manually add a product to your catalog</p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError(null);
                    setSuccess(false);
                    if (onCancel) onCancel();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="text-green-600" />
                  </div>
                  <p className="text-green-800 font-medium">Product added successfully!</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FiAlertCircle className="text-red-600" />
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input pl-10"
                        placeholder="e.g., Wireless Bluetooth Earbuds"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="relative">
                      <FiShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input pl-10"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Sports">Sports</option>
                        <option value="Toys">Toys</option>
                        <option value="Health">Health</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MOQ</label>
                    <input
                      type="number"
                      name="moq"
                      value={formData.moq}
                      onChange={handleInputChange}
                      min="0"
                      className="input"
                      placeholder="Minimum Order Quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost (per unit) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="input pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="input pl-8"
                        placeholder="0.00"
                      />
                    </div>
                    {formData.cost && formData.sellingPrice && (
                      <p className="text-xs mt-2 font-medium text-green-600 flex items-center gap-1">
                        <FiTrendingUp className="inline" />
                        Margin: {((parseFloat(formData.sellingPrice) - parseFloat(formData.cost)) / parseFloat(formData.sellingPrice) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Platform</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="vendorPlatform"
                        value={formData.vendorPlatform}
                        onChange={handleInputChange}
                        className="input pl-10"
                      >
                        <option value="">Select Platform</option>
                        <option value="Alibaba">Alibaba</option>
                        <option value="AliExpress">AliExpress</option>
                        <option value="IndiaMart">IndiaMart</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
                    <input
                      type="url"
                      name="sourceUrl"
                      value={formData.sourceUrl}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setError(null);
                      setSuccess(false);
                      if (onCancel) onCancel();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { FiTrendingUp } from 'react-icons/fi';
