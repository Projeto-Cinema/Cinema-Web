export interface Produto {
  id: number;
  cinema_id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  imagem_url: string;
  disponivel: boolean;
}