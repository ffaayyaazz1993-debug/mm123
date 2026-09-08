import React, { useState } from 'react';
import { MindNode } from '../types';

interface InsertMenuProps {
  node: MindNode;
  onClose: () => void;
  onInsertNote: (nodeId: string, note: string) => void;
  onInsertLabel: (nodeId: string, label: string) => void;
  onInsertTask: (nodeId: string) => void;
  onInsertLink: (nodeId: string, type: 'webpage' | 'topic' | 'file' | 'folder', url: string, title?: string) => void;
  onInsertAttachment: (nodeId: string, file: File) => void;
  onInsertAudioNote: (nodeId: string, duration: number, dataUrl?: string) => void;
  onInsertSticker: (nodeId: string, sticker: string) => void;
  onInsertIllustration: (nodeId: string, url: string, alt?: string) => void;
  onInsertEquation: (nodeId: string, equation: string) => void;
}

export const InsertMenu: React.FC<InsertMenuProps> = ({
  node,
  onClose,
  onInsertNote,
  onInsertLabel,
  onInsertTask,
  onInsertLink,
  onInsertAttachment,
  onInsertAudioNote,
  onInsertSticker,
  onInsertIllustration,
  onInsertEquation,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const menuItems = [
    { id: 'note', icon: '📝', label: 'Note', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { id: 'label', icon: '🏷️', label: 'Label', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { id: 'task', icon: '✅', label: 'Task', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
    { id: 'link', icon: '🔗', label: 'Link', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
    { id: 'attachment', icon: '📎', label: 'Attachment', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
    { id: 'audio', icon: '🎙️', label: 'Audio Note', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
    { id: 'sticker', icon: '🎨', label: 'Sticker', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
    { id: 'illustration', icon: '🖼️', label: 'Illustration', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
    { id: 'equation', icon: '∑', label: 'Equation', color: 'bg-gray-50 text-gray-600 hover:bg-gray-100' },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'task') {
      onInsertTask(node.id);
      onClose();
    } else {
      setActiveModal(itemId);
    }
  };

  if (activeModal) {
    return (
      <InsertModal
        type={activeModal}
        node={node}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => {
          switch (activeModal) {
            case 'note':
              onInsertNote(node.id, data.value);
              break;
            case 'label':
              onInsertLabel(node.id, data.value);
              break;
            case 'link':
              onInsertLink(node.id, data.linkType || 'webpage', data.url, data.title);
              break;
            case 'attachment':
              if (data.file) onInsertAttachment(node.id, data.file);
              break;
            case 'audio':
              onInsertAudioNote(node.id, data.duration || 0, data.dataUrl);
              break;
            case 'sticker':
              onInsertSticker(node.id, data.value);
              break;
            case 'illustration':
              onInsertIllustration(node.id, data.url, data.alt);
              break;
            case 'equation':
              onInsertEquation(node.id, data.value);
              break;
          }
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-[320px]" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Insert</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${item.color}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InsertModalProps {
  type: string;
  node: MindNode;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InsertModal: React.FC<InsertModalProps> = ({ type, node, onClose, onSubmit }) => {
  const [value, setValue] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [linkType, setLinkType] = useState<'webpage' | 'topic' | 'file' | 'folder'>('webpage');
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');

  const stickers = ['😀', '😎', '🎉', '🔥', '💡', '⭐', '🎯', '🚀', '💪', '👍', '❤️', '🌟', '🎨', '📚', '💼', '🏆'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (type) {
      case 'note':
      case 'label':
      case 'sticker':
      case 'equation':
        onSubmit({ value });
        break;
      case 'link':
        onSubmit({ linkType, url, title });
        break;
      case 'attachment':
        if (file) onSubmit({ file });
        break;
      case 'audio':
        onSubmit({ duration: 30, dataUrl: 'mock-audio-data' });
        break;
      case 'illustration':
        onSubmit({ url, alt });
        break;
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case 'note':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📝</span> Add Note
            </h3>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your note..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              autoFocus
            />
          </>
        );

      case 'label':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🏷️</span> Add Label
            </h3>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter label text..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </>
        );

      case 'link':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🔗</span> Add Link
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Type</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="webpage">🌐 Webpage</option>
                  <option value="topic">📌 Topic (Internal)</option>
                  <option value="file">📄 Local File</option>
                  <option value="folder">📁 Local Folder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {linkType === 'webpage' ? 'URL' : linkType === 'topic' ? 'Topic ID' : 'Path'}
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={linkType === 'webpage' ? 'https://...' : linkType === 'topic' ? 'topic-id' : '/path/to/...'}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Link title..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </>
        );

      case 'attachment':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📎</span> Add Attachment
            </h3>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </>
        );

      case 'audio':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎙️</span> Add Audio Note
            </h3>
            <div className="p-6 bg-pink-50 rounded-lg text-center">
              <p className="text-pink-600 mb-4">Audio recording feature</p>
              <p className="text-sm text-gray-600">Click to record (demo mode)</p>
              <button
                type="button"
                onClick={() => onSubmit({ duration: 30, dataUrl: 'mock-audio-data' })}
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Record 30s Demo
              </button>
            </div>
          </>
        );

      case 'sticker':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎨</span> Add Sticker
            </h3>
            <div className="grid grid-cols-8 gap-2">
              {stickers.map(sticker => (
                <button
                  key={sticker}
                  type="button"
                  onClick={() => onSubmit({ value: sticker })}
                  className="text-3xl p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </>
        );

      case 'illustration':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🖼️</span> Add Illustration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (optional)</label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Image description..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </>
        );

      case 'equation':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>∑</span> Add Equation
            </h3>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="E = mc² or LaTeX format..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono"
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              Supports basic math notation and LaTeX-style equations
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {renderModalContent()}
          
          {type !== 'sticker' && type !== 'audio' && (
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!value && !url && !file}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Insert
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
