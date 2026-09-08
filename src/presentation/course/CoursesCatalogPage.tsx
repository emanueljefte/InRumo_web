import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, X, BookOpen } from 'lucide-react';
import { COURSES_TEASER } from '../../data/course/coursesTeaser';

export default function CoursesCatalogPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = COURSES_TEASER.filter(
        (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 font-body text-[#1a1b22] antialiased">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Oferta Académica INSTIC</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1b22] tracking-tight">
                        Catálogo de Cursos
                    </h1>
                    <p className="font-body text-sm text-[#504536]">
                        Explora as opções académicas disponíveis no INSTIC.
                    </p>
                </div>

                {/* Input de Pesquisa */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar cursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-[#e8e7f1] text-xs text-[#1a1b22] placeholder:text-gray-400 pl-10 pr-9 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-xs"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition-colors cursor-pointer"
                            aria-label="Limpar pesquisa"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Lista de Cursos ou Estado Vazio */}
            {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e8e7f1] p-12 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1a1b22]">
                        Nenhum curso encontrado
                    </h3>
                    <p className="font-body text-xs text-[#504536] max-w-sm mx-auto">
                        Nenhum curso encontrado para "{searchTerm}".
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs font-bold text-primary hover:underline pt-2 inline-block cursor-pointer"
                    >
                        Limpar pesquisa
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const IconComponent = course.icon;
                        return (
                            <div
                                key={course.id}
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="bg-white rounded-2xl border border-[#e8e7f1] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                            >
                                <div>
                                    {/* Imagem do Curso */}
                                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={course.imageUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="p-6 space-y-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                                            <IconComponent className="w-4 h-4" />
                                        </div>

                                        <h3 className="font-heading text-lg font-bold text-[#1a1b22] group-hover:text-primary transition-colors leading-snug">
                                            {course.title}
                                        </h3>

                                        <p className="font-body text-xs text-[#504536] leading-relaxed">
                                            {course.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Rodapé do Cartão */}
                                <div className="px-6 pb-6 pt-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                                        Ver Detalhes
                                        <ChevronRight size={14} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}