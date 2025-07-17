export interface Assento {
  id: number;
  codigo: string;
  tipo: string;
  posicao_x: number;
  posicao_y: number;
  ativo: string;
  status?: 'disponivel' | 'ocupado' | 'selecionado';
}

export interface Sala {
  id: number;
  nome: string;
  capacidade: number;
  tipo: string;
  recursos: string;
  status: string;
  cinema_id: number;
  assentos: Assento[];
}
