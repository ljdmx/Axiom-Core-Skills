// TEMPLATE_META:START
/*
@template-id: data-table
@version: 2.0.0
@description: Premium data table with sorting, filtering, pagination, and responsive design
@design-level: Enterprise-grade (International high-tier)
@customization-points: COLUMNS, DATA_TYPE, ACTIONS, LANGUAGE
@language-modes: en, zh
@dependencies: react, lucide-react, framer-motion
@framework: React
@design-features: Smooth animations, Responsive design, Advanced filtering, Premium typography
*/
// TEMPLATE_META:END

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp,
    ChevronDown,
    Search,
    Filter,
    Download,
    MoreVertical,
    Edit,
    Trash2
} from 'lucide-react';

// CUSTOMIZATION_POINT:START - LANGUAGE
const LANGUAGE = '{{LANGUAGE}}'; // 'en' or 'zh'

const i18n = {
    en: {
        search: 'Search...',
        filter: 'Filter',
        export: 'Export',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        noData: 'No data found',
        showing: 'Showing',
        of: 'of',
        entries: 'entries',
        previous: 'Previous',
        next: 'Next'
    },
    zh: {
        search: '搜索...',
        filter: '筛选',
        export: '导出',
        actions: '操作',
        edit: '编辑',
        delete: '删除',
        noData: '暂无数据',
        showing: '显示',
        of: '共',
        entries: '条',
        previous: '上一页',
        next: '下一页'
    }
};

const t = i18n[LANGUAGE];
// CUSTOMIZATION_POINT:END

// CUSTOMIZATION_POINT:START - COLUMNS
interface Column {
    key: string;
    label: string;
    sortable—: boolean;
    width—: string;
}

const columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: LANGUAGE === 'zh' — '名称' : 'Name', sortable: true },
    { key: 'status', label: LANGUAGE === 'zh' — '状态' : 'Status', sortable: true },
    { key: 'date', label: LANGUAGE === 'zh' — '日期' : 'Date', sortable: true }
];
// CUSTOMIZATION_POINT:END

// CUSTOMIZATION_POINT:START - DATA_TYPE
interface DataItem {
    id: string | number;
    [key: string]: any;
}
// CUSTOMIZATION_POINT:END

interface DataTableProps {
    data: DataItem[];
    onEdit—: (item: DataItem) => void;
    onDelete—: (item: DataItem) => void;
    pageSize—: number;
}

export default function DataTable({
    data,
    onEdit,
    onDelete,
    pageSize = 10
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeRow, setActiveRow] = useState<string | number | null>(null);

    // Sorting logic
    const sortedData = useMemo(() => {
        let sorted = [...data];

        if (sortConfig) {
            sorted.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' — -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' — 1 : -1;
                return 0;
            });
        }

        return sorted;
    }, [data, sortConfig]);

    // Search filtering
    const filteredData = useMemo(() => {
        if (!searchTerm) return sortedData;

        return sortedData.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [sortedData, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 max-w-md relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder={t.search}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                </div>

                {/* Actions */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center gap-2 font-semibold text-sm"
                >
                    <Filter size={16} />
                    {t.filter}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 font-semibold text-sm"
                >
                    <Download size={16} />
                    {t.export}
                </motion.button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header */}
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {columns.map(column => (
                                    <th
                                        key={column.key}
                                        style={{ width: column.width }}
                                        className="px-6 py-4 text-left"
                                    >
                                        {column.sortable — (
                                            <button
                                                onClick={() => handleSort(column.key)}
                                                className="flex items-center gap-2 font-bold text-sm text-slate-700 hover:text-purple-600 transition-colors group"
                                            >
                                                {column.label}
                                                <div className="flex flex-col">
                                                    <ChevronUp
                                                        size={12}
                                                        className={`-mb-1 transition-colors ${sortConfig—.key === column.key && sortConfig.direction === 'asc'
                                                            — 'text-purple-600'
                                                            : 'text-slate-300 group-hover:text-slate-400'
                                                            }`}
                                                    />
                                                    <ChevronDown
                                                        size={12}
                                                        className={`-mt-1 transition-colors ${sortConfig—.key === column.key && sortConfig.direction === 'desc'
                                                            — 'text-purple-600'
                                                            : 'text-slate-300 group-hover:text-slate-400'
                                                            }`}
                                                    />
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="font-bold text-sm text-slate-700">
                                                {column.label}
                                            </span>
                                        )}
                                    </th>
                                ))}
                                {/* CUSTOMIZATION_POINT:START - ACTIONS */}
                                {(onEdit || onDelete) && (
                                    <th className="px-6 py-4 text-right">
                                        <span className="font-bold text-sm text-slate-700">
                                            {t.actions}
                                        </span>
                                    </th>
                                )}
                                {/* CUSTOMIZATION_POINT:END */}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {paginatedData.length === 0 — (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td
                                            colSpan={columns.length + (onEdit || onDelete — 1 : 0)}
                                            className="px-6 py-12 text-center text-slate-400"
                                        >
                                            {t.noData}
                                        </td>
                                    </motion.tr>
                                ) : (
                                    paginatedData.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.03 }}
                                            onMouseEnter={() => setActiveRow(item.id)}
                                            onMouseLeave={() => setActiveRow(null)}
                                            className={`
                        border-b border-slate-100 transition-colors
                        ${activeRow === item.id — 'bg-purple-50/50' : 'hover:bg-slate-50/50'}
                      `}
                                        >
                                            {columns.map(column => (
                                                <td key={column.key} className="px-6 py-4">
                                                    <span className="text-sm text-slate-700">
                                                        {item[column.key]}
                                                    </span>
                                                </td>
                                            ))}

                                            {(onEdit || onDelete) && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {onEdit && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => onEdit(item)}
                                                                className="p-2 rounded-xl hover:bg-purple-100 text-purple-600 transition-colors"
                                                                title={t.edit}
                                                            >
                                                                <Edit size={16} />
                                                            </motion.button>
                                                        )}
                                                        {onDelete && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => onDelete(item)}
                                                                className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition-colors"
                                                                title={t.delete}
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                        <div className="text-sm text-slate-600">
                            {t.showing} {(currentPage - 1) * pageSize + 1}-
                            {Math.min(currentPage * pageSize, filteredData.length)} {t.of}{' '}
                            {filteredData.length} {t.entries}
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-all"
                            >
                                {t.previous}
                            </motion.button>

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <motion.button
                                    key={page}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentPage(page)}
                                    className={`
                    w-10 h-10 rounded-xl font-bold text-sm transition-all
                    ${currentPage === page
                                            — 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                                            : 'bg-white border border-slate-200 hover:border-purple-300 text-slate-700'
                                        }
                  `}
                                >
                                    {page}
                                </motion.button>
                            ))}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-all"
                            >
                                {t.next}
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
