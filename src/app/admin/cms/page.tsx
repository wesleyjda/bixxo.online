'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Globe,
  FileEdit,
  Image as ImageIcon,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  History
} from 'lucide-react';

type ContentType = 'page' | 'post' | 'banner' | 'notice';
type ContentStatus = 'published' | 'draft' | 'disabled';

interface Content {
  id: string;
  title: string;
  type: ContentType;
  slug: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  publishDate?: string;
  expiryDate?: string;
  visibleInFooter?: boolean;
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pages' | 'posts' | 'banners' | 'logs'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Mock data
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      title: 'Termos de Uso',
      type: 'page',
      slug: 'termos-de-uso',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      author: 'Admin',
      metaTitle: 'Termos de Uso - Plataforma',
      metaDescription: 'Leia nossos termos de uso e condições',
      visibleInFooter: true
    },
    {
      id: '2',
      title: 'Política de Privacidade',
      type: 'page',
      slug: 'politica-privacidade',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18',
      author: 'Admin',
      visibleInFooter: true
    },
    {
      id: '3',
      title: 'Novidades da Plataforma',
      type: 'post',
      slug: 'novidades-plataforma',
      status: 'published',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      author: 'Marketing',
      category: 'Notícias'
    },
    {
      id: '4',
      title: 'Banner Promoção de Boas-Vindas',
      type: 'banner',
      slug: 'banner-boas-vindas',
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      author: 'Design',
      expiryDate: '2024-02-28'
    },
    {
      id: '5',
      title: 'Sobre Nós',
      type: 'page',
      slug: 'sobre-nos',
      status: 'draft',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25',
      author: 'Admin'
    },
    {
      id: '6',
      title: 'Manutenção Programada',
      type: 'notice',
      slug: 'manutencao-programada',
      status: 'published',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      author: 'TI',
      expiryDate: '2024-01-30'
    }
  ]);

  // Stats
  const stats = {
    total: contents.length,
    published: contents.filter(c => c.status === 'published').length,
    drafts: contents.filter(c => c.status === 'draft').length,
    notices: contents.filter(c => c.type === 'notice' && c.status === 'published').length,
    lastUpdate: contents.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt || '-'
  };

  // Filter contents
  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pages' && content.type === 'page') ||
                      (activeTab === 'posts' && content.type === 'post') ||
                      (activeTab === 'banners' && content.type === 'banner');
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const getStatusBadge = (status: ContentStatus) => {
    const styles = {
      published: 'bg-green-500/20 text-green-400 border-green-500/30',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      disabled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      disabled: 'Desativado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: ContentType) => {
    const styles = {
      page: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      post: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      banner: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      notice: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };

    const labels = {
      page: 'Página',
      post: 'Post',
      banner: 'Banner',
      notice: 'Aviso'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedContent(null);
    setShowModal(true);
  };

  const handleEdit = (content: Content) => {
    setModalMode('edit');
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setContents(contents.filter(c => c.id !== id));
    }
  };

  const handleDuplicate = (content: Content) => {
    const newContent = {
      ...content,
      id: String(Date.now()),
      title: `${content.title} (Cópia)`,
      slug: `${content.slug}-copia`,
      status: 'draft' as ContentStatus,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setContents([...contents, newContent]);
  };

  const handleToggleStatus = (id: string) => {
    setContents(contents.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'published' ? 'draft' : 'published' as ContentStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00FF88] to-[#0066FF] bg-clip-text text-transparent">
              CMS - Gerenciamento de Conteúdo
            </h1>
            <p className="text-gray-400">
              Crie, edite e publique páginas, posts e avisos do sistema
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-black font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            <Plus size={20} />
            Novo Conteúdo
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="text-blue-400" size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-gray-400">Total de Páginas</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.published}</div>
            <div className="text-sm text-gray-400">Publicadas</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <FileEdit className="text-yellow-400" size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.drafts}</div>
            <div className="text-sm text-gray-400">Rascunhos</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-cyan-400" size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.notices}</div>
            <div className="text-sm text-gray-400">Avisos Ativos</div>
          </div>

          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-purple-400" size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.lastUpdate}</div>
            <div className="text-sm text-gray-400">Última Atualização</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#1A1A1A]">
          {[
            { id: 'all', label: 'Todos', icon: FileText },
            { id: 'pages', label: 'Páginas', icon: Globe },
            { id: 'posts', label: 'Posts', icon: FileEdit },
            { id: 'banners', label: 'Banners', icon: ImageIcon },
            { id: 'logs', label: 'Histórico', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#00FF88] border-b-2 border-[#00FF88]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#00FF88] transition-colors"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#1A1A1A]">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88]"
                >
                  <option value="all">Todos</option>
                  <option value="page">Página</option>
                  <option value="post">Post</option>
                  <option value="banner">Banner</option>
                  <option value="notice">Aviso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88]"
                >
                  <option value="all">Todos</option>
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                  <option value="disabled">Desativado</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterStatus('all');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Table */}
      {activeTab !== 'logs' ? (
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Criado em</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Modificado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400">#{content.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{content.title}</div>
                      <div className="text-sm text-gray-400">{content.author}</div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(content.type)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LinkIcon size={14} />
                        /{content.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(content.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{content.createdAt}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{content.updatedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(content)}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-blue-400"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(content.id)}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-green-400"
                          title={content.status === 'published' ? 'Despublicar' : 'Publicar'}
                        >
                          {content.status === 'published' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button
                          onClick={() => handleDuplicate(content)}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-purple-400"
                          title="Duplicar"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors text-red-400"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum conteúdo encontrado</p>
            </div>
          )}
        </div>
      ) : (
        // Logs Tab
        <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Histórico de Alterações</h3>
          <div className="space-y-4">
            {[
              { date: '2024-01-25 14:30', user: 'Admin', action: 'criou', content: 'Sobre Nós', type: 'Página' },
              { date: '2024-01-22 10:15', user: 'Marketing', action: 'publicou', content: 'Novidades da Plataforma', type: 'Post' },
              { date: '2024-01-20 16:45', user: 'Admin', action: 'editou', content: 'Termos de Uso', type: 'Página' },
              { date: '2024-01-20 09:00', user: 'TI', action: 'criou', content: 'Manutenção Programada', type: 'Aviso' },
              { date: '2024-01-18 11:20', user: 'Admin', action: 'editou', content: 'Política de Privacidade', type: 'Página' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">{log.date}</div>
                  <div className="text-sm">
                    <span className="text-[#00FF88]">{log.user}</span>
                    {' '}{log.action}{' '}
                    <span className="font-medium">{log.content}</span>
                    {' '}({log.type})
                  </div>
                </div>
                <button className="px-3 py-1 text-sm text-blue-400 hover:bg-[#2A2A2A] rounded transition-colors">
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0F0F0F] border-b border-[#1A1A1A] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {modalMode === 'create' ? 'Novo Conteúdo' : 'Editar Conteúdo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  placeholder="Digite o título do conteúdo"
                  defaultValue={selectedContent?.title}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slug / URL *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <input
                    type="text"
                    placeholder="url-amigavel"
                    defaultValue={selectedContent?.slug}
                    className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
                  />
                </div>
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tipo de Conteúdo *
                  </label>
                  <select
                    defaultValue={selectedContent?.type || 'page'}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88]"
                  >
                    <option value="page">Página Institucional</option>
                    <option value="post">Post / Notícia</option>
                    <option value="banner">Banner</option>
                    <option value="notice">Aviso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status *
                  </label>
                  <select
                    defaultValue={selectedContent?.status || 'draft'}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88]"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="disabled">Desativado</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Imagem de Capa
                </label>
                <div className="border-2 border-dashed border-[#2A2A2A] rounded-lg p-8 text-center hover:border-[#00FF88] transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-400">Clique para fazer upload ou arraste a imagem</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Conteúdo *
                </label>
                <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] p-2 flex gap-2">
                    <button className="p-2 hover:bg-[#2A2A2A] rounded" title="Negrito">
                      <strong>B</strong>
                    </button>
                    <button className="p-2 hover:bg-[#2A2A2A] rounded" title="Itálico">
                      <em>I</em>
                    </button>
                    <button className="p-2 hover:bg-[#2A2A2A] rounded" title="Link">
                      <LinkIcon size={16} />
                    </button>
                    <button className="p-2 hover:bg-[#2A2A2A] rounded" title="Imagem">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  {/* Editor */}
                  <textarea
                    placeholder="Digite o conteúdo aqui..."
                    defaultValue={selectedContent?.content}
                    rows={12}
                    className="w-full px-4 py-3 bg-[#0F0F0F] text-white placeholder-gray-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* SEO Fields */}
              <div className="border-t border-[#1A1A1A] pt-6">
                <h3 className="text-lg font-semibold mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder="Título para SEO (60 caracteres)"
                      defaultValue={selectedContent?.metaTitle}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      placeholder="Descrição para SEO (160 caracteres)"
                      defaultValue={selectedContent?.metaDescription}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-[#1A1A1A]">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#00FF88] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    // Add save logic here
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-black font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Salvar Conteúdo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
