// Fresnel Effect Shader Module
// Usage: Include this block in your fragment shader to apply advanced rim lighting

/**
 * Calculates a fresnel factor.
 * @param viewDir Normalized vector from the surface point to the camera
 * @param normal Normalized surface normal vector
 * @param power Exponent for the fresnel curve (higher = tighter rim)
 * @param intensity Multiplier for the final effect
 * @return A float representing the fresnel intensity (0.0 to intensity)
 */
float getFresnel(vec3 viewDir, vec3 normal, float power, float intensity) {
    float f = dot(viewDir, normal);
    f = clamp(1.0 - f, 0.0, 1.0);
    f = pow(f, power);
    return f * intensity;
}

// Example integration in main():
// vec3 viewDir = normalize(cameraPosition - vPosition);
// float fre = getFresnel(viewDir, normal, 3.0, 1.5);
// vec3 finalColor = mix(baseColor, fresnelColor, fre);
