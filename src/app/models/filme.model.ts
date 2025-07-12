export interface Genero {
    id: number;
    nome: string;
}

export interface Filme {
    id: number;
    titulo: string;
    titulo_original: string;
    sinopse: string;
    duracao_min: number;
    diretor: string;
    elenco: string;
    classificacao: string;
    ano_lancamento: number;
    em_cartaz: boolean;
    generos: Genero[];
    url_poster?: string; 
}