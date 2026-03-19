import type {Plugin, Context} from '../types/plugins.js';
import type {GlobalReport} from '../types/report.js';

export const runPlugins = async (
  plugins: Plugin[],
  context: Context,
  report: GlobalReport,
) => {
  for (const plugin of plugins) {
    const {name, isEnabled, run} = plugin || {};
    const {config} = context || {};
    const {tools} = report || {};
    if (isEnabled(config)) {
      console.log(`▶ Running ${name}...`);
      tools[name as keyof typeof tools] = await run(context);
    }
  }
};
