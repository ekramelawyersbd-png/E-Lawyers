export interface SavedItem {
  id: string;
  title: string;
  type: 'article' | 'policy' | 'section';
  url: string;
  dateSaved: string;
}

export function getSavedItems(): SavedItem[] {
  const items = localStorage.getItem('readingList');
  return items ? JSON.parse(items) : [];
}

export function saveItem(item: SavedItem) {
  const items = getSavedItems();
  const index = items.findIndex(i => i.id === item.id);
  if (index === -1) {
    items.push(item);
    localStorage.setItem('readingList', JSON.stringify(items));
    window.dispatchEvent(new Event('bookmarksUpdated'));
  }
}

export function removeItem(id: string) {
  const items = getSavedItems();
  const newItems = items.filter(i => i.id !== id);
  localStorage.setItem('readingList', JSON.stringify(newItems));
  window.dispatchEvent(new Event('bookmarksUpdated'));
}

export function isItemSaved(id: string) {
  const items = getSavedItems();
  return items.some(i => i.id === id);
}
