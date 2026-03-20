// TEMPLATE_META:START
/*
@template-id: loading-spinner
@version: 1.0.0
@description: Elegant loading spinner using Tailwind and Framer Motion
@dependencies: framer-motion, lucide-react
@customization-points: SIZE, COLOR
@framework: Frontend
*/
// TEMPLATE_META:END

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const LoadingSpinner = ({ size = 24, className }: SpinnerProps) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className={`flex items-center justify-center ${className}`}
        >
            <Loader2 size={size} className="text-primary" />
        </motion.div>
    );
};
