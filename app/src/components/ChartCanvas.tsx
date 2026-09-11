import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

interface Props {
  config: ChartConfiguration;
  height?: 'lg' | 'md' | 'sm';
  /** Screen-reader description, since a canvas is opaque to assistive tech. */
  summary: string;
}

/**
 * Owns one Chart.js instance. The config is rebuilt by the caller whenever the
 * theme changes, and Chart.js bakes colours in at construction — so the effect
 * destroys and recreates rather than trying to patch options in place.
 */
export function ChartCanvas({ config, height = 'md', summary }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, [config]);

  return (
    <div className={'chart chart--' + height}>
      <canvas ref={ref} role="img" aria-label={summary} />
      <span className="sr-only">{summary}</span>
    </div>
  );
}
