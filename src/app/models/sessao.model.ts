export interface Sessao {
  id: number;
  data: string;
  horario_ini: string;
  horario_fim: string;
  idioma: string;
  legendado: boolean;
  formato: string;
  preco_base: number;
  status: string;
  filme_id: number;
  sala_id: number;
}
