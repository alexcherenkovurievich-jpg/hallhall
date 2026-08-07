/** Все тексты сайта в одном месте — править здесь. */

export const NAV = [
  { href: '#about',    label: 'О месте' },
  { href: '#house',    label: 'Дом' },
  { href: '#area',     label: 'Территория' },
  { href: '#services', label: 'Услуги' },
  { href: '#gallery',  label: 'Галерея' },
  { href: '#contacts', label: 'Контакты' },
];

export const CONTACTS = {
  yuriy:      { name: 'Юрий',      phone: '+7 917 617-81-59', tel: '+79176178159' },
  ekaterina:  { name: 'Екатерина', phone: '+7 967 376-99-65', tel: '+79673769965' },
  telegram:   'https://t.me/yugo_zapad_hall',
  vk:         'https://vk.ru/ugo_zapad_hall',
};

export const HOUSE_SPECS = [
  'До 8 гостей с ночёвкой — 4 изолированные спальни',
  'До 12 человек за общим столом',
  'Тёплые полы, кондиционер, Wi-Fi',
  'Холодильник, электрочайник, душевая, санузел',
  'Посуда, бельё, полотенца, халаты каждому, питьевая вода',
];

export const ZONES = [
  {
    n: '01',
    title: 'Веранда',
    items: [
      'Открытая беседка с прозрачной крышей, до 20 гостей',
      'Мини-кухня, холодильник, санузел',
      'В тёплый сезон',
    ],
    photo: { src: '/images/photos/07-area-veranda.jpg', w: 1500, h: 1125,
      alt: 'Веранда под прозрачной крышей: длинный стол, стулья, за оградой зелень и батут' },
  },
  {
    n: '02',
    title: 'Мангальная зона',
    items: [
      'Два мангала с печью под казан',
      'У дома — под навесом, с лёгким копчением',
    ],
    flip: true,
    photo: { src: '/images/photos/08-area-grill.jpg', w: 1280, h: 960,
      alt: 'Мангальная зона под навесом у забора из горбыля, рядом кованая беседка с зонтом' },
  },
];

export const FIRE_ZONE = {
  n: '03',
  title: 'Костровая зона',
  items: ['Костровая чаша, кресла, тёплые пледы', 'Дрова предоставляем'],
  photo: { src: '/images/photos/09-area-fire.jpg', w: 1280, h: 960,
    alt: 'Костровая чаша, деревянные кресла вокруг и коряги на гравии' },
};

export const SERVICES = [
  {
    title: 'Русская баня',
    items: [
      'На дровах, комната отдыха до 6 человек',
      'Разогрев к заезду, топка — всё время аренды',
      'Шапочки, халаты, полотенца, травяная запарка',
    ],
    photo: { src: '/images/photos/10-sauna.jpg', w: 1125, h: 1500, pos: 'center 62%',
      alt: 'Баня-бочка со скруглённой крышей среди деревьев' },
  },
  {
    title: 'Банный чан',
    items: ['На дровах, 6–8 человек, разогрет до +40°', 'Травы и хвоя по сезону'],
    tone: 't-ember',
    label: 'ФОТО · банный чан',
  },
  {
    title: 'Бассейны',
    items: [
      'Большой 3×5 м → танцпол на сдвижных платформах',
      'Малый с подогревом до +30° под куполом-сферой (01.05–30.09)',
      'Шезлонги на деревянном настиле',
    ],
    tone: 't-water',
    label: 'ФОТО · бассейны',
  },
];

/** Галерея: реальных кадров пока нет — только рамки под будущие фото. */
export const GALLERY = Array.from({ length: 10 }, (_, i) => ({
  tone: ['t-forest', 't-wood', 't-linen', 't-water', 't-ember',
         't-night', 't-steam', 't-linen', 't-forest', 't-wood'][i],
  label: `фото ${String(i + 1).padStart(2, '0')}`,
}));

export const REVIEWS = Array.from({ length: 7 }, (_, i) => ({
  tone: ['t-linen', 't-wood', 't-steam', 't-linen', 't-water', 't-wood', 't-linen'][i],
  label: `скрин отзыва ${String(i + 1).padStart(2, '0')}`,
}));
