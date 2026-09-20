import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

/** Call from any Officer/Admin page to set the topbar title + subtitle. */
export default function usePageMeta(title, subtitle) {
  const ctx = useOutletContext();
  useEffect(() => {
    if (ctx?.setPageMeta) ctx.setPageMeta({ title, subtitle });
  }, [title, subtitle]); // eslint-disable-line react-hooks/exhaustive-deps
}
