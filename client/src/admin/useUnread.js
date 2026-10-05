import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export const MESSAGES_CHANGED = 'messages:changed';

/** Number of unread contact messages; refreshes every minute and whenever messages change. */
export function useUnread() {
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(() => {
    api
      .get('/admin/stats')
      .then((s) => setUnread(s.unread))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 60_000);
    window.addEventListener(MESSAGES_CHANGED, refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener(MESSAGES_CHANGED, refresh);
    };
  }, [refresh]);

  return unread;
}
