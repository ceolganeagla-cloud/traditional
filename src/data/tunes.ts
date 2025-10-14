export type Tune = { id:string; title:string; type:string; abc:string }
export type Song = { id:string; title:string; lyrics:string }

export const tunes: Tune[] = [
  { id:'kesh', title:'The Kesh', type:'Jig', abc:`X:1
T:The Kesh
R:Jig
M:6/8
L:1/8
K:G
D|GFG BAB|gfg dBG|` },
  { id:'butterfly', title:'The Butterfly', type:'Slip Jig', abc:`X:1
T:The Butterfly
R:Slip Jig
M:9/8
L:1/8
K:Em
E3 B3 A3 | G3 E3 D2E | E3 B3 A3 | G3 E3 D2E |
E3 B3 A3 | G3 E3 D2E | B3 e3 d3 | B3 A3 G3 :|
|: e3 g3 b3 | a3 g3 e2d | e3 g3 b3 | a3 g3 e2d |
e3 g3 b3 | a3 g3 e2d | B3 e3 d3 | B3 A3 G3 :|` }
]

export const songs: Song[] = [
  { id:'nil-se-n-la', title:\"Níl Sé 'n Lá\", lyrics:\"Níl sé 'n lá, tá sé ina oíche...\" }
]
