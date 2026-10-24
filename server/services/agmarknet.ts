import { config } from '../config';
import { store } from '../store';
import { CommodityMarketData } from '../../src/types';

export async function fetchAgmarknetLiveFeed(): Promise<{ source: 'REAL_API' | 'DYNAMIC_SIMULATION'; data: CommodityMarketData[] }> {
  if (config.dataGovInApiKey) {
    try {
      console.log('[Agmarknet] Querying real data.gov.in Agmarknet API endpoint...');
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(config.dataGovInApiKey)}&format=json&limit=50`;
      const res = await fetch(url, { headers: { 'User-Agent': 'MandiFlow-NationalAgri/2.4' } });
      
      if (res.ok) {
        const json = await res.json();
        if (json.records && Array.isArray(json.records) && json.records.length > 0) {
          console.log(`[Agmarknet] Successfully fetched ${json.records.length} records from data.gov.in!`);
          
          // Map real records into our 10 vegetable commodity slots
          const updated = store.commodities.map(comm => {
            const match = json.records.find((r: any) => 
              (r.commodity && r.commodity.toLowerCase().includes(comm.name.split(' ')[0].toLowerCase())) ||
              (r.Commodity && r.Commodity.toLowerCase().includes(comm.name.split(' ')[0].toLowerCase()))
            );
            if (match) {
              const modal = parseFloat(match.modal_price || match.Modal_Price) || comm.modalPrice;
              const min = parseFloat(match.min_price || match.Min_Price) || comm.minPrice;
              const max = parseFloat(match.max_price || match.Max_Price) || comm.maxPrice;
              return {
                ...comm,
                modalPrice: Math.round(modal),
                minPrice: Math.round(min),
                maxPrice: Math.round(max),
                dailyChange: Math.round(((modal - comm.modalPrice) / comm.modalPrice) * 1000) / 10,
              };
            }
            return comm;
          });

          store.updateCommodityPrices(updated);
          return { source: 'REAL_API', data: updated };
        }
      }
      console.warn('[Agmarknet] data.gov.in returned empty or non-200. Falling back to dynamic live simulation.');
    } catch (err) {
      console.error('[Agmarknet] Network error querying data.gov.in:', err);
    }
  }

  // Real-time dynamic volatility simulation
  const simulated = store.commodities.map(comm => {
    // Generate realistic ±0.8% micro-volatility
    const deltaPercent = (Math.random() * 2 - 0.95);
    const newModal = Math.max(comm.minPrice, Math.round(comm.modalPrice * (1 + deltaPercent / 100)));
    return {
      ...comm,
      modalPrice: newModal,
      dailyChange: Math.round(deltaPercent * 10) / 10,
    };
  });

  store.updateCommodityPrices(simulated);
  return { source: 'DYNAMIC_SIMULATION', data: simulated };
}
