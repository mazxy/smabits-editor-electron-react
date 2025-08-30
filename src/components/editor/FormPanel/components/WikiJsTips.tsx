
/**
 * ═══════════════════════════════════════════════════════════════
 *                    WIKIJS SHORTCODE GENERATOR
 * ═══════════════════════════════════════════════════════════════
 * @file      FormPanel.tsx
 * @module    components/editor/FormPanel
 * @author    Massimiliano Rossetto
 * @version   1.0.0
 * @desc      Main form for Wiki.js shortcode generation
 * ═══════════════════════════════════════════════════════════════
 */


import React from "react";
import { ShortcodeType } from "../../../../types";
import './WikiJsTips.css';  

interface WikiJsTipsProps {
    shortcodeType: ShortcodeType;
    className?: string;
}

// Suggerimenti specifici per tipo equazione
function WikiJsTips({ shortcodeType, className = '' }: WikiJsTipsProps) {
    if (shortcodeType === 'eq') {
        return (
            <div className = { `form-tips wikijs-tips ${className} ` }>
                <h4>Suggerimenti per Equazioni Wiki.js</h4>
                <ul>
                    <li>Formula inline: <code>x^2 + y^2 = z^2</code></li>
                    <li>Frazione: <code>\frac{'{'}a{'}'}{'{'}b{'}'}</code></li>
                    <li>Integrale: <code>\int_0^1 f(x)dx</code></li>
                    <li>Sommatoria: <code>\sum_{'{'}i=1{'}'}^n x_i</code></li>
                    <li>Matrice: <code>\begin{'{'}matrix{'}'} a & b \\ c & d \end{'{'}matrix{'}'}</code></li>
                </ul>
            </div>
        );
    }

    // Suggerimenti generici per altri tipi
    return (
        <div className={`form-tips wikijs-tips ${className}`}>
            <h4>💡 Suggerimenti Wiki.js</h4>
            <ul>
                <li>Usa <code>\ref{'{'}label{'}'}</code> per riferimenti incrociati</li>
                <li>Formule inline: <code>$x^2 + y^2$</code></li>
                <li>Formule display: <code>$$\int_0^1 f(x)dx$$</code></li>
                <li>Ambiente equation: <code>\begin{'{'}equation{'}'} ... \end{'{'}equation{'}'}</code></li>
            </ul>
        </div>
    );
}
export default WikiJsTips;
