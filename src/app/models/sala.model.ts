export interface Assento {
  id: number;
  posicao: string;
  status: 'disponivel' | 'ocupado' | 'selecionado';
  tipo: string;
}

export interface Sala {
  id: number;
  nome: string;
  capacidade: number;
  tipo: string;
  recursos: string;
  mapa_assentos: string; 
  status: string;
  cinema_id: number;
  assentos: Assento[];
}
