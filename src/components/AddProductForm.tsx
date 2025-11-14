/**
 * Add Product Form Component
 * Allows users to manually add products to their catalog
 */

'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

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
        throw new Error(data.error || 'Failed to add product');
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
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
      >
        <FiPlus /> Add Product Manually
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                setError(null);
                setSuccess(false);
                if (onCancel) onCancel();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              <p className="text-green-700">Product added successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Wireless Bluetooth Earbuds"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cost (per unit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Selling Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                {formData.cost && formData.sellingPrice && (
                  <p className="text-xs mt-1 text-gray-500">
                    Profit Margin: {((parseFloat(formData.sellingPrice) - parseFloat(formData.cost)) / parseFloat(formData.sellingPrice) * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">MOQ (Minimum Order Quantity)</label>
                <input
                  type="number"
                  name="moq"
                  value={formData.moq}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vendor Platform</label>
                <select
                  name="vendorPlatform"
                  value={formData.vendorPlatform}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Platform</option>
                  <option value="Alibaba">Alibaba</option>
                  <option value="AliExpress">AliExpress</option>
                  <option value="IndiaMart">IndiaMart</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Source URL</label>
                <input
                  type="url"
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                  setSuccess(false);
                  if (onCancel) onCancel();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
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
      </div>
    </div>
  );
}

