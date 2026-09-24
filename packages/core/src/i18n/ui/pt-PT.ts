import type { UiDictionary } from './en';

/**
 * ============================================================================
 * European Portuguese
 * ============================================================================
 *
 * Written, not machine-translated, and a few decisions are worth stating so
 * that whoever extends this stays consistent rather than guessing:
 *
 * • **`tu`, not `você`.** The course talks to one learner the way a person
 *   would. `Você` reads as a bank letter in Portugal, and the whole point of
 *   the tone is that this is not one.
 *
 * • **European vocabulary.** `ecrã` not `tela`, `telemóvel` not `celular`,
 *   `a seguir` not `próximo` where it means "next in a sequence". The locale
 *   is `pt-PT` precisely so these can be right; a Brazilian catalogue can
 *   disagree with every one of them later without touching this file.
 *
 * • **Banco de Portugal / ECB terminology for the domain.** `banco central`,
 *   `banco comercial`, `reservas`, `balanço`, `ativo` / `passivo`. In
 *   accounting Portuguese the last two are nouns — `o ativo`, `o passivo` —
 *   never adjectives, which is why they stay singular even when that side of
 *   the sheet has a dozen lines on it.
 *
 * • **The 1990 spelling reform**, which Portugal has used officially since
 *   2009: `ativo`, `objetivo`, `diretamente`, `correção`, and months in lower
 *   case. Silent consonants go. Words where European Portuguese still
 *   *pronounces* the consonant keep it — `facto`, `contacto`, `convicção` —
 *   and those are exactly the ones a find-and-replace gets wrong, so they are
 *   worth checking by hand whenever a file is added.
 *
 * • **Untranslated is not broken.** Any key omitted here falls back to
 *   English on its own, per key. Removing a bad translation is always safe.
 */
// ─── generated below · `npm run i18n:import` rewrites from here ───────────

export const ptPT: UiDictionary = {
  'account.signIn': 'Continuar com a Google',
  'account.signOut': 'Terminar sessão',
  'account.signOutOf': 'Terminar a sessão da conta de {name}',
  'account.optional': 'Opcional — podes aprender sem conta. Iniciar sessão guarda a tua sequência e os teus XP em todos os dispositivos, e leva contigo o progresso deste.',
  'account.sync.merging': 'A juntar o progresso que fizeste offline…',
  'account.sync.pushing': 'A sincronizar…',
  'account.sync.pending': 'Guardado neste dispositivo · sincroniza quando voltares a ter rede',
  'account.sync.synced': 'Progresso sincronizado com a tua conta',
  'account.delete': 'Eliminar conta',
  'account.delete.open': 'Eliminar a tua conta',
  'account.delete.title': 'Eliminar esta conta',
  'account.delete.body': 'Os teus XP, a tua sequência e o histórico de lições são apagados e não podem ser recuperados. O curso continua a funcionar neste dispositivo, com a sessão terminada.',
  'account.delete.accountIs': 'Esta conta inicia sessão como',
  'account.delete.confirmLabel': 'Escreve {email} para confirmar',
  'account.delete.confirmLabelGeneric': 'Escreve o teu endereço de email para confirmar',
  'account.delete.placeholder': 'o teu email',
  'account.delete.keep': 'Manter',
  'account.delete.confirm': 'Eliminar definitivamente',
  'account.delete.confirmA11y': 'Eliminar esta conta permanentemente',
  'account.delete.busy': 'A eliminar…',
  'account.delete.failed': 'Não resultou.',
  'account.delete.unreachable': 'Não foi possível contactar o servidor.',
  'account.delete.expired': 'A tua sessão expirou. Inicia sessão outra vez.',
  'tabs.home': 'Início',
  'tabs.progress': 'Progresso',
  'tabs.account': 'Conta',
  'progress.title': 'Progresso',
  'progress.stat.xp': 'XP ganho',
  'progress.stat.lessons': 'de {total, plural, one {# lição} other {# lições}}',
  'progress.stat.streak': 'Dias seguidos',
  'progress.module.count': '{done, number} / {total, number}',
  'progress.memory.title': 'Memória',
  'progress.memory.blurb':
    'O que o curso te viu errar, e quando tenciona voltar a perguntar. Isto nunca sai do teu dispositivo.',
  'progress.memory.tracked': 'a acompanhar',
  'progress.memory.week': 'esta semana',
  'progress.memory.lapsed': 'ganharam ferrugem',
  'progress.memory.weakest': 'Mais frágil neste momento',
  'account.title': 'Conta',
  'account.danger': 'Zona de perigo',
  'path.xp': '{count, number} XP',
  'path.module': 'Módulo {number, number}',
  'path.module.progress': '{done, number} / {total, number}',
  'path.module.done': 'Concluído',

  'review.title': 'Revisão',
  'review.due': '{count, plural, one {# coisa para rever} other {# coisas para rever}}',
  'review.blurb': 'Perguntas que estás prestes a esquecer, de todo o curso.',
  'review.empty': 'Nada para rever hoje',
  'review.empty.blurb':
    'Acaba uma lição e aquilo em que erraste volta aqui, espaçado no tempo para ficar.',
  'review.start': 'Começar revisão',
  'review.from': 'De {lesson}',
  'review.done.title': 'Revisão concluída',
  'review.done.body':
    '{count, plural, one {# pergunta revista} other {# perguntas revistas}}. Cada uma volta mais tarde, e mais cedo se te custou.',
  'review.done.close': 'Voltar ao percurso',
  'path.streak': '{count, plural, one {sequência de # dia} other {sequência de # dias}}',
  'path.lesson.minutes': '{count, number} min',
  'path.lesson.steps': '{count, plural, one {# passo} other {# passos}}',
  'path.lesson.best': 'melhor: {count, number} XP',
  'path.lesson.open': 'Começar a lição: {title}',
  'path.contribute.title': 'Vêm aí mais lições',
  'path.contribute.body': 'O OpenMacro é open source. Uma lição é um único ficheiro TypeScript — põe o teu em {lessons}, regista-o em {registry} e aparece aqui mesmo.',
  'path.reset': 'Apagar progresso',
  'path.reset.armed': 'Toca outra vez para apagar todo o progresso',
  'path.reset.armedA11y': 'Toca outra vez para confirmar que queres apagar o progresso',
  'lesson.exit': 'Sair da lição',
  'lesson.check': 'Verificar',
  'lesson.continue': 'Continuar',
  'lesson.gotIt': 'Percebi',
  'lesson.outOfHearts': 'Ficaste sem vidas',
  'lesson.hearts': '{count, plural, one {# vida restante} other {# vidas restantes}} de {max, number}',
  'lesson.combo': '{count, plural, one {# seguida} other {# seguidas}}',
  'lesson.video.play': 'Reproduzir {title}',
  'lesson.video.minutes': '{count, number} min',
  'lesson.video.watchFirst': 'Vê primeiro',
  'lesson.video.privacy': 'Não carrega nada até carregares em reproduzir',
  'lesson.video.hide': 'Esconder',
  'lesson.video.show': 'Mostrar',
  'challenge.order.dragHint': 'Mantém um passo premido e arrasta para reordenar',
  'challenge.order.position': 'Passo {number, number} de {total, number}: {label}',
  'challenge.order.moveUp': 'Mover para cima',
  'challenge.order.moveDown': 'Mover para baixo',
  'challenge.match.term': 'Termo',
  'challenge.match.means': 'Significa',
  'challenge.match.hint': 'Toca aqui e depois num significado para os ligar',
  'challenge.sim.try': 'Experimenta {value}',
  'challenge.sim.goal': 'O teu objetivo',
  'challenge.taccount.entries': 'Lançamentos a fazer',
  'challenge.taccount.moved': 'O que se moveu',
  'challenge.taccount.assets': 'ativo',
  'challenge.taccount.liabilities': 'passivo',
  'challenge.taccount.assetsTitle': 'Ativo',
  'challenge.taccount.liabilitiesTitle': 'Passivo',
  'challenge.taccount.balanced': 'Equilibrado',
  'challenge.taccount.offBy': 'Desfasado em {amount}',
  'challenge.taccount.expands': 'Expande',
  'challenge.taccount.contracts': 'Contrai',
  'challenge.taccount.unchanged': 'Inalterado',
  'challenge.taccount.post': 'Lançar {amount} em {account} no {side} de {entity}',
  'challenge.taccount.remove': 'Remover o lançamento de {account}',
  'entity.central_bank': 'Banco central',
  'entity.commercial_bank': 'Banco comercial',
  'entity.shadow_bank': 'Banco paralelo',
  'entity.fiduciary_core': 'Núcleo fiduciário',
  'grade.correct.1': 'É isso mesmo!',
  'grade.correct.2': 'Exatamente',
  'grade.correct.3': 'Acertaste em cheio',
  'grade.correct.4': 'Certinho',
  'grade.incorrect.1': 'Não é bem assim',
  'grade.incorrect.2': 'Perto, mas não',
  'grade.incorrect.3': 'Vamos ver outra vez',
  'grade.match.partial': 'Acertaste {matched, number} de {total, plural, one {# par} other {# pares}}.',
  'grade.order.step': 'O passo {number, number} devia ser «{label}».',
  'grade.sim.open': '{count, plural, one {Falta # objetivo} other {Faltam # objetivos}}.',
  'grade.taccount.unbalanced': 'O balanço de {entity} não fecha — o ativo e o passivo têm de se mover juntos.',
  'grade.taccount.unexpected': '{entity} não devia ter uma rubrica «{account}» nesta operação.',
  'grade.taccount.wrongAmount': 'O montante de «{account}» em {entity} não está certo.',
  'grade.taccount.missingAsset': 'Falta um lançamento no ativo de {entity}.',
  'grade.taccount.missingLiability': 'Falta um lançamento no passivo de {entity}.',
  'complete.flawless': 'Sem um único erro!',
  'complete.title': 'Lição concluída',
  'complete.xpEarned': 'XP ganhos',
  'complete.bestCombo': 'Melhor seguida',
  'complete.takeaways': 'O que acabaste de aprender',
  'complete.backToPath': 'Voltar ao percurso',
  'complete.finish': 'Terminar',
  'complete.again': 'Praticar outra vez',
  'failed.title': 'Ficaste sem vidas',
  'failed.body': 'Não faz mal — {lesson} trama quase toda a gente à primeira.',
  'failed.retry': 'Tentar outra vez',
  'notFound.title': 'Lição não encontrada',
  'notFound.body': 'Não há nenhuma lição registada com o id «{id}».',
  'update.ready': 'Há lições novas prontas.',
  'update.restart': 'Reiniciar',
  'update.restartA11y': 'Reiniciar para carregar as lições novas',
  'map.title': 'Faz uma lição',
  'map.finished': '{done, number} de {total, number} concluídas',
  'map.live': '{count, plural, one {# lição disponível} other {# lições disponíveis}} · vêm mais a caminho',
  'map.resume': 'Retoma onde ficaste',
  'path.resume.context': '{level} · {module}',
  'map.best': 'Melhor {best, number} / {total, number} XP',
  'map.runs': '{count, plural, one {# tentativa} other {# tentativas}}',
  'level.count': '{count, plural, one {# módulo} other {# módulos}}',
  'level.beginner': 'Iniciante',
  'level.beginner.blurb': 'Não pressupõe nada',
  'level.intermediate': 'Médio',
  'level.intermediate.blurb': 'Pressupõe que sabes o que é um depósito',
  'level.advanced': 'Avançado',
  'level.advanced.blurb': 'Pressupõe a interface e as alavancas',

  'level.beginner.unlocks':
    'Ler o saldo da tua conta pelo que ele é — uma promessa de um banco — e acompanhar uma decisão de taxas nas notícias sem acreditar na palavra de ninguém sobre o que significa.',
  'level.intermediate.unlocks':
    'Avaliar um crédito à habitação, um empréstimo ou uma obrigação pelo que te custam na realidade, ler uma curva de rendimentos e julgar a compra de uma casa pela aritmética e não pela vontade.',
  'level.advanced.unlocks':
    'Ler os balanços da Fed e do BCE linha a linha, fixar uma taxa diretora e defendê-la com os dados que tinhas no momento, e dirigir a instituição.',
  'difficulty.intro': 'Introdução',
  'difficulty.core': 'Base',
  'difficulty.advanced': 'Avançado',
  'challenge.kind.multiple_choice': 'Escolhe a melhor resposta',
  'challenge.kind.concept_match': 'Liga cada par',
  'challenge.kind.order_flow': 'Põe isto por ordem',
  'challenge.kind.interactive_sim': 'Corre o modelo',
  'challenge.kind.t_account_flow': 'Faz os lançamentos',
  'lesson.leave': 'Sair desta lição',
  'lesson.progress': 'Progresso da lição',
  'lesson.xpEarnedA11y': '{count, number} XP ganhos',
  'lesson.permalink': 'esta pergunta',
  'lesson.hint.correct': 'Boa — continua.',
  'lesson.hint.incorrect': 'Voltamos a esta mais à frente.',
  'lesson.hint.ready': 'Quando quiseres.',
  'lesson.hint.answer': 'Responde para continuar.',
  'lesson.announceCorrect': 'Certo.',
  'lesson.announceIncorrect': 'Não é bem assim.',
  'failed.webBody': 'Não perdeste nada — as vidas existem para te obrigar a abrandar no mecanismo, não para te fechar a porta. Faz {lesson} outra vez e o que já sabias passa depressa.',
  'complete.backToLessons': 'Voltar às lições',
  'complete.next': 'Lição seguinte',
  'complete.noMistakes': 'Sem erros',
  'complete.saving': 'A guardar na tua conta…',
  'complete.saved': 'Guardado na conta de {name}.',
  'complete.saveFailed': 'Não foi possível contactar a tua conta — esta sessão está segura neste dispositivo e sincroniza da próxima vez.',
  'complete.signedIn': 'Sessão iniciada.',
  'complete.savedLocally': 'Guardado neste dispositivo. Inicia sessão para o manteres em todos os dispositivos e começares uma sequência.',
  'complete.optional': 'Opcional. As lições são gratuitas de qualquer maneira.',
  'language.label': 'Idioma',
  'language.choose': 'Mostrar o curso em {name}',
  'language.partial': 'Este idioma ainda está a ser traduzido. O que ainda não estiver traduzido aparece em inglês.',
};
