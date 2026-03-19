# Micro-Interactions Library

## Overview
Enterprise-grade micro-interaction design library - detailed animations to enhance user experience.

---

## Button Interactions

### 1. Ripple Effect

```css
.btn-ripple {
    position: relative;
    overflow: hidden;
}

.btn-ripple::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-ripple:active::before {
    width: 300px;
    height: 300px;
}
```

### 2. Magnetic Hover

```javascript
// JavaScript for magnetic effect
const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});
```

```css
.btn-magnetic {
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 3. Elastic Scale

```css
@keyframes elasticScale {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); }
}

.btn-elastic:active {
    animation: elasticScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## Input Interactions

### 1. Floating Label

```html
<div class="input-float">
    <input type="text" id="email" placeholder=" " required>
    <label for="email">Email Address</label>
</div>
```

```css
.input-float {
    position: relative;
}

.input-float input {
    width: 100%;
    padding: 20px 0 6px;
    border: none;
    border-bottom: 2px solid #ddd;
    font-size: 16px;
    transition: border-color 0.3s;
}

.input-float input:focus {
    outline: none;
    border-bottom-color: #6366f1;
}

.input-float label {
    position: absolute;
    left: 0;
    top: 20px;
    color: #999;
    font-size: 16px;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.input-float input:focus + label,
.input-float input:not(:placeholder-shown) + label {
    top: 0;
    font-size: 12px;
    color: #6366f1;
}
```

### 2. Shake on Error

```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.input-error {
    animation: shake 0.5s;
    border-color: #ef4444 !important;
}
```

### 3. Success Checkmark

```html
<div class="input-success">
    <input type="text">
    <svg class="checkmark" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25"/>
        <path class="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
</div>
```

```css
.checkmark {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
}

.input-success.show .checkmark {
    opacity: 1;
}

.checkmark-circle {
    stroke: #10b981;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
    stroke: #10b981;
    stroke-width: 3;
    fill: none;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}

@keyframes stroke {
    100% { stroke-dashoffset: 0; }
}
```

---

## Card Interactions

### 1. Tilt on Hover

```javascript
const tiltCards = document.querySelectorAll('.card-tilt');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});
```

```css
.card-tilt {
    transition: transform 0.1s;
    transform-style: preserve-3d;
}
```

### 2. Expand on Click

```css
.card-expand {
    max-height: 200px;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-expand.expanded {
    max-height: 1000px;
}
```

---

## Toggle & Checkbox

### 1. Smooth Toggle

```html
<label class="toggle">
    <input type="checkbox">
    <span class="slider"></span>
</label>
```

```css
.toggle {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toggle input:checked + .slider {
    background-color: #6366f1;
}

.toggle input:checked + .slider:before {
    transform: translateX(26px);
}
```

### 2. Animated Checkbox

```html
<label class="checkbox-animated">
    <input type="checkbox">
    <span class="checkmark"></span>
    <span class="label-text">I agree to terms</span>
</label>
```

```css
.checkbox-animated {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.checkbox-animated input {
    display: none;
}

.checkbox-animated .checkmark {
    width: 24px;
    height: 24px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 12px;
    position: relative;
    transition: all 0.3s;
}

.checkbox-animated .checkmark::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox-animated input:checked + .checkmark {
    background: #6366f1;
    border-color: #6366f1;
}

.checkbox-animated input:checked + .checkmark::after {
    transform: rotate(45deg) scale(1);
}
```

---

## Loading States

### 1. Skeleton Screen

```css
@keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
}

.skeleton {
    background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
    border-radius: 4px;
}

.skeleton-text {
    height: 16px;
    margin-bottom: 8px;
}

.skeleton-title {
    height: 24px;
    width: 60%;
    margin-bottom: 16px;
}
```

### 2. Pulse Loader

```css
@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.95);
    }
}

.loader-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 3. Spinner

```html
<div class="spinner">
    <div class="spinner-circle"></div>
</div>
```

```css
@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
}

.spinner-circle {
    width: 100%;
    height: 100%;
    border: 4px solid #f3f3f3;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

---

## Notification Toasts

### Slide-in Toast

```css
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toast.hiding {
    animation: slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## Progress Indicators

### Linear Progress

```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 60%"></div>
</div>
```

```css
.progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## Usage Recommendations

### Performance Optimization
```css
/* Use will-change to hint browser */
.will-animate {
    will-change: transform, opacity;
}

/* Remove after animation is done */
.animation-done {
    will-change: auto;
}
```

### Reduced Motion (Accessibility)
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Summary

The Power of Micro-Interactions:

✅ **Instant Feedback** - Visual confirmation of user actions  
✅ **Guide Attention** - Direct user focus to important elements  
✅ **Enhanced Engagement** - Make interfaces more vivid and interesting  
✅ **Brand Personality** - Reflect unique product identity  

Remember: Good micro-interactions should be **subtle, purposeful, and delightful**.
