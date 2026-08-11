<template>
  <div class="wedding-app">
    <div
      v-if="gateVisible"
      class="invitation-gate"
      :class="`is-${introState}`"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      <div class="gate-glow gate-glow-one" aria-hidden="true"></div>
      <div class="gate-glow gate-glow-two" aria-hidden="true"></div>
      <div class="leaf-shadow leaf-shadow-left" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
      <div class="leaf-shadow leaf-shadow-right" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>

      <button
        v-if="introState === 'sealed'"
        class="skip-intro"
        type="button"
        @click="skipIntro"
      >
        Saltar introducción
      </button>

      <div class="gate-content">
        <div class="gate-heading">
          <p class="eyebrow">Una invitación para ti</p>
          <h1 id="gate-title">Hay días que se guardan para siempre</h1>
        </div>

        <button
          class="envelope-trigger"
          type="button"
          :disabled="introState !== 'sealed'"
          aria-label="Abrir la invitación de boda de Lizbeth y Enrique"
          @click="openInvitation"
        >
          <span class="envelope-stage" aria-hidden="true">
            <span class="envelope-ground-shadow"></span>
            <span class="envelope">
              <span class="envelope-back"></span>
              <span class="envelope-letter">
                <span class="letter-kicker">Nos casamos</span>
                <span class="letter-names">Lizbeth <em>&amp;</em> Enrique</span>
                <span class="letter-rule"></span>
                <span class="letter-date">09 · 01 · 2027</span>
              </span>
              <span class="envelope-flap envelope-flap-top"></span>
              <span class="envelope-flap envelope-flap-left"></span>
              <span class="envelope-flap envelope-flap-right"></span>
              <span class="envelope-flap envelope-flap-bottom"></span>
              <span class="wax-seal">
                <span class="wax-inner">L <b>·</b> E</span>
              </span>
            </span>
          </span>
        </button>

        <div class="open-prompt" aria-hidden="true">
          <span class="prompt-line"></span>
          <span>Toca el sello para abrir</span>
          <span class="prompt-line"></span>
        </div>
      </div>

      <div class="floating-petal petal-one" aria-hidden="true"></div>
      <div class="floating-petal petal-two" aria-hidden="true"></div>
      <div class="floating-petal petal-three" aria-hidden="true"></div>
    </div>

    <main
      ref="mainContent"
      class="invitation"
      :class="{ 'is-ready': invitationReady }"
      :aria-hidden="!invitationReady"
      :inert="!invitationReady"
      tabindex="-1"
    >
      <nav class="topbar" aria-label="Navegación principal">
        <a class="nav-monogram" href="#inicio" aria-label="Volver al inicio">L · E</a>
        <div class="nav-links">
          <a href="#detalles">Detalles</a>
          <a href="#itinerario">Itinerario</a>
          <a class="nav-rsvp" href="#rsvp">Confirmar</a>
        </div>
      </nav>

      <section id="inicio" class="hero-section">
        <div class="hero-paper-grain" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit-one" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit-two" aria-hidden="true"></div>

        <div class="hero-copy">
          <p class="eyebrow hero-eyebrow">Nuestra boda · Mazatlán</p>
          <div class="hero-title-wrap">
            <p class="hero-pretitle">Celebremos</p>
            <h1 class="hero-title">
              <span>Lizbeth</span>
              <b>&amp;</b>
              <span>Enrique</span>
            </h1>
          </div>
          <p class="hero-date">Sábado · 9 de enero · 2027</p>
          <p class="hero-intro">
            Elegimos el para siempre y queremos celebrarlo rodeados de las personas que han sido
            parte de nuestra historia.
          </p>
          <a class="button button-dark" href="#detalles">
            Descubre los detalles <ArrowDown :size="17" aria-hidden="true" />
          </a>
        </div>

        <div class="hero-visual" aria-label="Fotografía de boda de referencia">
          <div class="hero-photo-mat">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=86"
              alt="Decoración floral elegante de una ceremonia de boda"
              width="1400"
              height="1750"
              fetchpriority="high"
            />
            <span class="photo-number">01</span>
          </div>
          <div class="hero-seal" aria-hidden="true">L · E</div>
          <p class="hero-side-note">Nueve · Enero · Dos mil veintisiete</p>
        </div>

        <a class="scroll-cue" href="#historia" aria-label="Continuar a nuestra historia">
          <span>Desliza</span>
          <ArrowDown :size="18" aria-hidden="true" />
        </a>
      </section>

      <section id="historia" class="story-section section-shell">
        <div class="story-photos" data-reveal="left">
          <div class="story-photo story-photo-main">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85"
              alt="Pareja celebrando su boda entre árboles"
              width="960"
              height="1200"
              loading="lazy"
            />
          </div>
          <div class="story-photo story-photo-detail">
            <img
              src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=700&q=85"
              alt="Detalle romántico de una pareja el día de su boda"
              width="560"
              height="700"
              loading="lazy"
            />
          </div>
          <p class="hand-note">Tú, yo<br />y todos los días.</p>
        </div>

        <div class="story-copy" data-reveal="right">
          <p class="section-kicker">Nuestra historia</p>
          <h2 class="section-title">De todos los caminos, elegimos caminar juntos.</h2>
          <p class="story-lead">
            De nadie seré, solo de ti. Hasta que mis huesos se vuelvan cenizas y mi corazón deje de
            latir.
          </p>
          <p class="body-copy">
            Cada risa, cada viaje y cada día cotidiano nos trajo hasta aquí. Hoy abrimos un nuevo
            capítulo y nos hace inmensamente felices saber que tú estarás presente.
          </p>

          <div class="music-card" :style="musicProgressStyle">
            <audio
              ref="musicPlayer"
              preload="none"
              loop
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Gymnopedie_No._1_%28ISRC_USUAN1100787%29.mp3"
              @play="isMusicPlaying = true"
              @pause="isMusicPlaying = false"
              @timeupdate="updateMusicProgress"
              @loadedmetadata="updateMusicProgress"
              @error="musicUnavailable = true"
            ></audio>
            <button
              class="music-play"
              type="button"
              :aria-label="isMusicPlaying ? 'Pausar música' : 'Reproducir música'"
              :aria-pressed="isMusicPlaying"
              :disabled="musicUnavailable"
              @click="toggleMusic"
            >
              <Pause v-if="isMusicPlaying" :size="19" fill="currentColor" aria-hidden="true" />
              <Play v-else :size="19" fill="currentColor" aria-hidden="true" />
            </button>
            <div class="music-meta">
              <span class="music-label">Para acompañar esta invitación</span>
              <strong>Gymnopédie No. 1</strong>
              <span class="music-time">{{ formattedMusicTime }}</span>
            </div>
            <div class="music-wave" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
          </div>
          <p v-if="musicUnavailable" class="music-error" role="status">
            La pista no está disponible en este momento.
          </p>
        </div>
      </section>

      <section class="save-date-section">
        <div class="save-date-glow" aria-hidden="true"></div>
        <div class="save-date-copy" data-reveal="up">
          <p class="section-kicker section-kicker-light">Guarda la fecha</p>
          <h2 class="section-title section-title-light">El comienzo de nuestro para siempre</h2>
          <p>
            Con la bendición de Dios y de nuestras familias, tenemos el honor de invitarte a
            celebrar nuestra unión.
          </p>

          <div class="countdown" aria-hidden="true">
            <div v-for="unit in countdownUnits" :key="unit.label" class="countdown-unit">
              <strong>{{ unit.value }}</strong>
              <span>{{ unit.label }}</span>
            </div>
          </div>
          <p class="sr-only" role="status">{{ accessibleCountdown }}</p>
        </div>

        <div class="calendar-card" data-reveal="up">
          <div class="calendar-header">
            <span>Enero</span>
            <strong>2027</strong>
          </div>
          <div class="calendar-grid calendar-weekdays" aria-hidden="true">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-grid" aria-label="Calendario de enero de 2027, boda el día 9">
            <span
              v-for="(day, index) in calendarDays"
              :key="`${day}-${index}`"
              :class="{ 'is-empty': !day, 'is-wedding-day': day === 9 }"
            >
              {{ day || '' }}
              <Heart v-if="day === 9" :size="42" aria-hidden="true" />
            </span>
          </div>
          <p>El gran día · 05:30 PM</p>
        </div>
      </section>

      <section id="detalles" class="details-section section-shell">
        <header class="section-heading centered" data-reveal="up">
          <p class="section-kicker">Dónde nos encontraremos</p>
          <h2 class="section-title">Ceremonia &amp; celebración</h2>
          <p>Dos momentos, un mismo lugar y todas las ganas de compartirlos contigo.</p>
        </header>

        <div class="event-cards">
          <article v-for="event in events" :key="event.title" class="event-card" data-reveal="up">
            <div class="event-icon-wrap">
              <component :is="event.icon" :size="29" stroke-width="1.45" aria-hidden="true" />
            </div>
            <p class="event-type">{{ event.type }}</p>
            <h3>{{ event.title }}</h3>
            <p class="event-time">{{ event.time }}</p>
            <p class="event-place">{{ event.place }}</p>
            <p class="event-address">{{ event.address }}</p>
            <a :href="event.map" target="_blank" rel="noreferrer">
              Ver ubicación <ArrowUpRight :size="16" aria-hidden="true" />
            </a>
            <span class="event-card-number" aria-hidden="true">{{ event.number }}</span>
          </article>
        </div>
      </section>

      <section id="itinerario" class="timeline-section">
        <div class="timeline-heading" data-reveal="left">
          <p class="section-kicker">Itinerario</p>
          <h2 class="section-title">Una tarde para recordar toda la vida</h2>
          <p class="body-copy">
            Queremos que disfrutes cada momento. Llega con tiempo, encuentra tu lugar y déjate llevar
            por la celebración.
          </p>
          <div class="timeline-monogram" aria-hidden="true">L<span>&amp;</span>E</div>
        </div>

        <div class="timeline-list">
          <article
            v-for="(item, index) in timeline"
            :key="item.time"
            class="timeline-item"
            data-reveal="right"
            :style="{ '--item-delay': `${index * 80}ms` }"
          >
            <div class="timeline-marker">
              <component :is="item.icon" :size="22" stroke-width="1.55" aria-hidden="true" />
            </div>
            <time>{{ item.time }}</time>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="photo-break" aria-label="Un momento de nuestra historia">
        <img
          src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1800&q=86"
          alt="Celebración de boda al aire libre con luces cálidas"
          width="1800"
          height="1100"
          loading="lazy"
        />
        <div class="photo-break-overlay"></div>
        <blockquote data-reveal="up">
          <span>“</span>
          Que todos nuestros días tengan un poco de la alegría de esta noche.
        </blockquote>
      </section>

      <section class="guide-section section-shell">
        <header class="section-heading centered" data-reveal="up">
          <p class="section-kicker">Para disfrutar juntos</p>
          <h2 class="section-title">Los pequeños detalles</h2>
        </header>

        <div class="guide-grid">
          <article class="guide-card dress-card" data-reveal="left">
            <Shirt :size="32" stroke-width="1.4" aria-hidden="true" />
            <p class="guide-number">01</p>
            <p class="section-kicker">Código de vestimenta</p>
            <h3>Formal de jardín</h3>
            <p>
              Telas ligeras, zapatos cómodos y ese look con el que te sientas increíble. La
              celebración será al aire libre.
            </p>
            <div class="palette-row" aria-label="Paleta sugerida">
              <span style="--swatch: #98aa9d"></span>
              <span style="--swatch: #b3c9d6"></span>
              <span style="--swatch: #697c70"></span>
              <span style="--swatch: #2d3536"></span>
              <span style="--swatch: #d8c9b8"></span>
            </div>
            <p class="reserved-note">Blanco, marfil y tonos similares están reservados para la novia.</p>
          </article>

          <article class="guide-card gift-card" data-reveal="right">
            <Gift :size="32" stroke-width="1.4" aria-hidden="true" />
            <p class="guide-number">02</p>
            <p class="section-kicker">Sugerencia de regalo</p>
            <h3>Tu presencia es lo más importante</h3>
            <p>
              El mejor regalo será compartir este día contigo. Si deseas tener un detalle con
              nosotros, contaremos con una caja de sobres durante la recepción.
            </p>
            <div class="envelope-gift" aria-hidden="true">
              <span></span>
              <em>L · E</em>
            </div>
          </article>
        </div>
      </section>

      <section class="recommendations-section">
        <div class="recommendations-inner">
          <header data-reveal="up">
            <p class="section-kicker section-kicker-light">Notas para el gran día</p>
            <h2>Antes de celebrar</h2>
          </header>
          <div class="recommendations-grid">
            <article v-for="item in recommendations" :key="item.title" data-reveal="up">
              <component :is="item.icon" :size="27" stroke-width="1.45" aria-hidden="true" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="rsvp" class="rsvp-section">
        <div class="rsvp-decoration rsvp-decoration-one" aria-hidden="true"></div>
        <div class="rsvp-decoration rsvp-decoration-two" aria-hidden="true"></div>

        <div class="rsvp-intro" data-reveal="left">
          <p class="section-kicker section-kicker-light">Répondez s'il vous plaît</p>
          <h2>¿Nos acompañas?</h2>
          <p>
            Agradecemos tu confirmación antes del <strong>15 de diciembre de 2026</strong>. Registra
            una respuesta por teléfono para ayudarnos a preparar cada detalle.
          </p>
          <div class="rsvp-signature">Lizbeth &amp; Enrique</div>
        </div>

        <div class="rsvp-card" data-reveal="right">
          <form v-if="!rsvpPrepared" :aria-busy="isRsvpSubmitting" @submit.prevent="prepareRsvp">
            <div class="field-group">
              <label for="guest-name">Tu nombre</label>
              <input
                id="guest-name"
                v-model.trim="rsvp.name"
                type="text"
                autocomplete="name"
                placeholder="Nombre y apellido"
                required
              />
            </div>

            <div class="field-group">
              <label for="guest-phone">Teléfono celular</label>
              <input
                id="guest-phone"
                :value="rsvp.phone"
                type="tel"
                inputmode="numeric"
                autocomplete="tel-national"
                placeholder="(669) 123 4567"
                maxlength="14"
                pattern="\(\d{3}\) \d{3} \d{4}"
                aria-describedby="guest-phone-help"
                required
                @input="handlePhoneInput"
              />
              <small id="guest-phone-help" class="field-help">
                Usaremos los 10 dígitos para evitar registros duplicados.
              </small>
            </div>

            <fieldset class="field-group attendance-options">
              <legend>¿Podrás acompañarnos?</legend>
              <label :class="{ selected: rsvp.attendance === 'yes' }">
                <input v-model="rsvp.attendance" type="radio" value="yes" />
                <Heart :size="18" aria-hidden="true" />
                Sí, ahí estaré
              </label>
              <label :class="{ selected: rsvp.attendance === 'no' }">
                <input v-model="rsvp.attendance" type="radio" value="no" />
                No podré asistir
              </label>
            </fieldset>

            <div v-if="rsvp.attendance === 'yes'" class="field-group">
              <label for="guest-count">Personas incluidas en tu invitación</label>
              <select id="guest-count" v-model="rsvp.guests">
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
              </select>
            </div>

            <div class="field-group">
              <label for="guest-note">Mensaje para los novios <span>(opcional)</span></label>
              <textarea
                id="guest-note"
                v-model.trim="rsvp.note"
                rows="3"
                placeholder="Alergias, restricciones o un mensaje especial"
              ></textarea>
            </div>

            <button
              class="button button-moss button-full"
              type="submit"
              :disabled="isRsvpSubmitting"
            >
              {{ isRsvpSubmitting ? 'Guardando respuesta…' : 'Confirmar asistencia' }}
              <ChevronRight v-if="!isRsvpSubmitting" :size="18" aria-hidden="true" />
            </button>
            <p v-if="rsvpError" class="form-status is-error" role="alert">{{ rsvpError }}</p>
          </form>

          <div v-else class="rsvp-ready">
            <CircleCheck :size="44" stroke-width="1.35" aria-hidden="true" />
            <p class="section-kicker">Confirmación recibida</p>
            <h3>Gracias, guardamos tu respuesta</h3>
            <p class="rsvp-saved-copy">
              Tu registro quedó asociado al teléfono {{ rsvp.phone }}.
            </p>
            <textarea :value="rsvpMessage" rows="6" readonly aria-label="Mensaje de confirmación"></textarea>
            <button class="button button-moss button-full" type="button" @click="shareRsvp">
              <Share2 :size="18" aria-hidden="true" />
              {{ shareButtonLabel }}
            </button>
            <p class="share-status" aria-live="polite">{{ shareStatus }}</p>
          </div>
        </div>
      </section>

      <footer class="closing-section">
        <div class="closing-photo" data-reveal="left">
          <img
            src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=86"
            alt="Pareja compartiendo un momento romántico al atardecer"
            width="1000"
            height="1250"
            loading="lazy"
          />
          <span aria-hidden="true">L · E</span>
        </div>
        <div class="closing-copy" data-reveal="right">
          <p class="section-kicker">Gracias por ser parte</p>
          <h2>Nos encantará verte.</h2>
          <p>
            Cuenta los días con nosotros. Tu cariño y tu presencia harán que esta celebración sea
            todavía más especial.
          </p>
          <div class="closing-names">Lizbeth <i>&amp;</i> Enrique</div>
          <p class="closing-date">09 · 01 · 2027</p>
          <button class="replay-button" type="button" @click="replayIntro">
            <DoorOpen :size="17" aria-hidden="true" /> Volver a ver el sobre
          </button>
        </div>
        <div class="footer-meta">
          <span>Hecho con amor para nuestro gran día</span>
          <a
            href="https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1_(ISRC_USUAN1100787).mp3"
            target="_blank"
            rel="noreferrer"
          >
            Música: Kevin MacLeod · CC BY 3.0
          </a>
        </div>
      </footer>

      <button
        v-if="invitationReady"
        class="floating-music"
        type="button"
        :class="{ 'is-playing': isMusicPlaying }"
        :aria-label="isMusicPlaying ? 'Pausar música' : 'Reproducir música'"
        :aria-pressed="isMusicPlaying"
        :disabled="musicUnavailable"
        @click="toggleMusic"
      >
        <span class="floating-music-icon">
          <Pause v-if="isMusicPlaying" :size="16" fill="currentColor" aria-hidden="true" />
          <Music2 v-else :size="16" aria-hidden="true" />
        </span>
        <span>{{ isMusicPlaying ? 'Sonando' : 'Música' }}</span>
        <span class="equalizer" aria-hidden="true"><i></i><i></i><i></i></span>
      </button>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ArrowDown,
  ArrowUpRight,
  Baby,
  ChevronRight,
  Church,
  CircleCheck,
  Clock3,
  DoorOpen,
  Flower2,
  Gift,
  GlassWater,
  Heart,
  MapPin,
  MoonStar,
  Music2,
  PartyPopper,
  Pause,
  Play,
  Share2,
  Shirt,
  Trees,
  UtensilsCrossed,
} from '@lucide/vue'
import { apiUrl } from './config/api'

const EVENT_DATE = new Date('2027-01-09T17:30:00-07:00')

const gateVisible = ref(true)
const introState = ref('sealed')
const invitationReady = ref(false)
const mainContent = ref(null)
const musicPlayer = ref(null)
const isMusicPlaying = ref(false)
const musicUnavailable = ref(false)
const musicCurrentTime = ref(0)
const musicDuration = ref(0)
const now = ref(new Date())
const rsvpPrepared = ref(false)
const isRsvpSubmitting = ref(false)
const rsvpError = ref('')
const shareStatus = ref('')
const canNativeShare = ref(false)
const timers = new Set()
let countdownTimer
let revealObserver

const rsvp = reactive({
  name: '',
  phone: '',
  attendance: 'yes',
  guests: '1',
  note: '',
})

const events = [
  {
    icon: Church,
    number: '01',
    type: 'Ceremonia',
    title: 'Jardín principal',
    time: '05:30 PM',
    place: 'Jardín Las Rosas',
    address: 'Av. de los Encinos 248 · Salón Terraza',
    map: 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Las+Rosas+Av.+de+los+Encinos+248',
  },
  {
    icon: PartyPopper,
    number: '02',
    type: 'Recepción',
    title: 'Cena & celebración',
    time: '07:00 PM',
    place: 'Salón Terraza',
    address: 'A unos pasos de la ceremonia',
    map: 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Las+Rosas+Av.+de+los+Encinos+248',
  },
]

const timeline = [
  { icon: MapPin, time: '05:00 PM', title: 'Llegada', text: 'Recepción de invitados y bienvenida.' },
  { icon: Heart, time: '05:30 PM', title: 'Ceremonia', text: 'Intercambio de votos en el jardín principal.' },
  { icon: GlassWater, time: '06:30 PM', title: 'Cóctel', text: 'Fotografías, bocadillos y primeras copas.' },
  { icon: UtensilsCrossed, time: '07:30 PM', title: 'Cena', text: 'Cena servida, brindis y palabras especiales.' },
  { icon: Music2, time: '09:00 PM', title: 'Fiesta', text: 'Abrimos la pista para celebrar juntos.' },
  { icon: MoonStar, time: '12:30 AM', title: 'Hasta pronto', text: 'El final de la fiesta, el inicio de todo.' },
]

const recommendations = [
  {
    icon: Clock3,
    title: 'Sé puntual',
    text: 'Te sugerimos llegar 20 minutos antes para recibirte con calma.',
  },
  {
    icon: Baby,
    title: 'Noche de adultos',
    text: 'Queremos que disfrutes sin preocupaciones; este evento será solo para adultos.',
  },
  {
    icon: Trees,
    title: 'Celebración al aire libre',
    text: 'Elige calzado cómodo y considera una capa ligera para la noche.',
  },
]

const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const calendarDays = [
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
]

const timeRemaining = computed(() => {
  const difference = Math.max(EVENT_DATE.getTime() - now.value.getTime(), 0)
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
})

const countdownUnits = computed(() => [
  { label: 'Días', value: padNumber(timeRemaining.value.days) },
  { label: 'Horas', value: padNumber(timeRemaining.value.hours) },
  { label: 'Min', value: padNumber(timeRemaining.value.minutes) },
  { label: 'Seg', value: padNumber(timeRemaining.value.seconds) },
])

const accessibleCountdown = computed(() => {
  if (!timeRemaining.value.days && !timeRemaining.value.hours && !timeRemaining.value.minutes) {
    return 'El gran día ha llegado.'
  }

  return `Faltan ${timeRemaining.value.days} días, ${timeRemaining.value.hours} horas y ${timeRemaining.value.minutes} minutos para la boda.`
})

const musicProgressStyle = computed(() => ({
  '--music-progress': `${musicDuration.value ? (musicCurrentTime.value / musicDuration.value) * 100 : 0}%`,
}))

const formattedMusicTime = computed(() => {
  const current = formatTime(musicCurrentTime.value)
  const duration = musicDuration.value ? formatTime(musicDuration.value) : '3:07'
  return `${current} / ${duration}`
})

const rsvpMessage = computed(() => {
  const greeting = `Hola Lizbeth y Enrique, soy ${rsvp.name}.`
  const response =
    rsvp.attendance === 'yes'
      ? `Con mucha ilusión confirmo mi asistencia para ${rsvp.guests} ${rsvp.guests === '1' ? 'persona' : 'personas'} a su boda del 9 de enero de 2027.`
      : 'Lamento no poder acompañarlos el 9 de enero de 2027, pero estaré celebrando su amor a la distancia.'
  const note = rsvp.note ? `\n\nMensaje: ${rsvp.note}` : ''

  return `${greeting}\n\n${response}${note}`
})

const shareButtonLabel = computed(() => (canNativeShare.value ? 'Compartir respuesta' : 'Copiar respuesta'))

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function schedule(callback, delay) {
  const timer = window.setTimeout(() => {
    timers.delete(timer)
    callback()
  }, delay)
  timers.add(timer)
}

function openInvitation() {
  if (introState.value !== 'sealed') return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  introState.value = 'opening'

  schedule(revealInvitation, reducedMotion ? 120 : 1850)
  schedule(() => {
    gateVisible.value = false
  }, reducedMotion ? 360 : 2650)
}

function skipIntro() {
  if (introState.value !== 'sealed') return
  introState.value = 'skipping'
  schedule(revealInvitation, 80)
  schedule(() => {
    gateVisible.value = false
  }, 480)
}

async function revealInvitation() {
  invitationReady.value = true
  document.body.classList.remove('intro-locked')
  await nextTick()
  mainContent.value?.focus({ preventScroll: true })
}

function replayIntro() {
  musicPlayer.value?.pause()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  invitationReady.value = false
  introState.value = 'sealed'
  gateVisible.value = true
  document.body.classList.add('intro-locked')
}

async function toggleMusic() {
  if (!musicPlayer.value || musicUnavailable.value) return
  try {
    if (musicPlayer.value.paused) {
      await musicPlayer.value.play()
    } else {
      musicPlayer.value.pause()
    }
  } catch {
    musicUnavailable.value = true
  }
}

function updateMusicProgress() {
  if (!musicPlayer.value) return
  musicCurrentTime.value = musicPlayer.value.currentTime || 0
  musicDuration.value = musicPlayer.value.duration || 0
}

function handlePhoneInput(event) {
  rsvp.phone = formatPhone(event.target.value)
}

function normalizePhone(value) {
  return value.replace(/\D/g, '').slice(0, 10)
}

function formatPhone(value) {
  const digits = normalizePhone(value)
  if (!digits) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`
}

async function prepareRsvp() {
  rsvpError.value = ''
  shareStatus.value = ''

  const phone = normalizePhone(rsvp.phone)
  if (phone.length !== 10) {
    rsvpError.value = 'Escribe un teléfono celular de 10 dígitos.'
    return
  }

  isRsvpSubmitting.value = true

  try {
    const response = await fetch(apiUrl('/api/rsvps'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: rsvp.name,
        phone,
        attendance: rsvp.attendance,
        guest_count: rsvp.attendance === 'yes' ? Number(rsvp.guests) : 0,
        note: rsvp.note,
      }),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 409 && result.code === 'RSVP_PHONE_EXISTS') {
        throw new Error('Este teléfono ya tiene una confirmación registrada.')
      }

      throw new Error(result.message || 'No pudimos guardar tu confirmación.')
    }

    rsvpPrepared.value = true
  } catch (error) {
    rsvpError.value =
      error instanceof Error
        ? error.message
        : 'No pudimos conectar con la invitación. Inténtalo nuevamente.'
  } finally {
    isRsvpSubmitting.value = false
  }
}

async function shareRsvp() {
  shareStatus.value = ''
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Confirmación · Boda de Lizbeth y Enrique',
        text: rsvpMessage.value,
      })
      shareStatus.value = 'Respuesta compartida. ¡Gracias!'
      return
    } catch (error) {
      if (error?.name === 'AbortError') {
        shareStatus.value = 'No se compartió nada. Puedes intentarlo cuando quieras.'
        return
      }
    }
  }

  const copied = await copyText(rsvpMessage.value)
  shareStatus.value = copied
    ? 'Respuesta copiada. Ya puedes pegarla en tu conversación con los novios.'
    : 'Selecciona y copia el mensaje de arriba para enviarlo a los novios.'
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    textarea.remove()
    return copied
  }
}

onMounted(() => {
  document.body.classList.add('intro-locked')
  canNativeShare.value = typeof navigator.share === 'function'
  countdownTimer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.16, rootMargin: '0px 0px -7% 0px' },
  )

  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))
})

onBeforeUnmount(() => {
  document.body.classList.remove('intro-locked')
  window.clearInterval(countdownTimer)
  timers.forEach((timer) => window.clearTimeout(timer))
  revealObserver?.disconnect()
  musicPlayer.value?.pause()
})
</script>
