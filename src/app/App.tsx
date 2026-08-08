import React, { useState } from "react";
import {
  LayoutDashboard, BookOpen, Map, Users, Trophy, BarChart2,
  Bell, Search, ChevronRight, ChevronDown,
  Plus, Edit2, Eye, Copy, Archive, Trash2, Flame, Star, Award,
  TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle,
  Shield, Stethoscope, Activity, Target, Download, Filter, Calendar, Save,
  User, Medal, Gift, ChevronLeft, Zap, Lock,
  FileCheck, X, Layers, Info, ArrowRight,
  Sparkles, Award as AwardIcon, PenLine, Send
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type View =
  | "dashboard" | "quizzes" | "quiz-builder" | "heatmap" | "staff"
  | "gamification" | "reports" | "protocols" | "learning-paths"
  | "certifications" | "calendar";

interface Quiz {
  id: number; emoji: string; title: string; area: string;
  category: string; roles: string[];
  status: "active" | "draft" | "scheduled" | "archived";
  completions: number; avgScore: number; createdAt: string;
}
interface StaffMember {
  id: number; name: string; initials: string; role: string; area: string;
  pts: number; streak: number; completions: number; avgScore: number;
  status: "active" | "risk" | "inactive";
  gradientFrom: string; gradientTo: string;
  certs: string[]; hireDate: string;
}
interface BuilderQuestion {
  id: number; type: "multiple" | "truefalse"; scenario: string;
  emoji: string; text: string; options: string[]; correct: number; explanation: string;
}
interface BuilderInfo {
  title: string; description: string; area: string; category: string;
  roles: string[]; shift: string; emoji: string;
}
interface BuilderSettings {
  ptsPerQ: number; timePerQ: number;
  pubType: "immediate" | "scheduled" | "recurring";
  pubDate: string; pubTime: string; frequency: string;
  requireSignature: boolean; sendNotif: boolean; hideAnswers: boolean;
}

interface ExamQuestion {
  id: number; text: string; type: "multiple" | "truefalse";
  options: string[]; correct: number; explanation: string;
}
interface ProtoItem {
  id: number; emoji: string; title: string; sub: string;
  desc: string; updated: string; tag: string;
  area: "medica" | "peluqueria" | "petshop" | "operaciones";
}
interface PathStage {
  id: number; period: string; title: string; modules: string[];
}
interface LearningPath {
  id: number; title: string; role: string; description: string;
  color: string; icon: string; duration: string;
  stages: PathStage[];
  assignedStaff: number[];
  tutorId: number | null;
  hasFinalExam: boolean;
  passingScore: number;
  examQuestions: ExamQuestion[];
  certTitle: string; certSubtitle: string; certIssuer: string;
  createdAt: string;
}

interface Certificate {
  id: number; recipientName: string; recipientRole: string;
  pathTitle: string; score: number; date: string; issuer: string;
  certSubtitle: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AREAS = ["Médica", "UCI", "Peluquería", "PetShop", "Recepción", "Operaciones"];
const ROLES = ["Médico Veterinario", "Asistente Médico", "Counter", "Groomer", "Jefe de Piso", "Auxiliar"];
const AREA_COLOR: Record<string, string> = {
  Médica: "#4F46E5", UCI: "#ef4444", Peluquería: "#ec4899",
  PetShop: "#22c55e", Recepción: "#f59e0b", Operaciones: "#8b5cf6",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_QUIZZES: Quiz[] = [
  { id: 1, emoji: "🚨", title: "Triaje y Emergencias Críticas", area: "UCI", category: "Emergencias", roles: ["Médico Veterinario", "Asistente Médico"], status: "active", completions: 42, avgScore: 87, createdAt: "2026-07-01" },
  { id: 2, emoji: "🧤", title: "Bioseguridad y Manejo de Residuos", area: "Operaciones", category: "Bioseguridad", roles: ["Todos"], status: "active", completions: 98, avgScore: 91, createdAt: "2026-07-05" },
  { id: 3, emoji: "💊", title: "Cadena de Frío y Vacunas", area: "Médica", category: "Inventario", roles: ["Asistente Médico", "Jefe de Piso"], status: "active", completions: 54, avgScore: 79, createdAt: "2026-07-10" },
  { id: 4, emoji: "✂️", title: "Técnicas de Corte por Raza", area: "Peluquería", category: "Protocolos Clínicos", roles: ["Groomer"], status: "active", completions: 25, avgScore: 83, createdAt: "2026-07-08" },
  { id: 5, emoji: "🛒", title: "Nutrición y Recomendación de Alimento", area: "PetShop", category: "Atención al Cliente", roles: ["Counter"], status: "scheduled", completions: 0, avgScore: 0, createdAt: "2026-07-12" },
  { id: 6, emoji: "🐕", title: "Inducción: Bienvenida y Cultura VetCenter", area: "Recepción", category: "Inducción", roles: ["Todos"], status: "active", completions: 67, avgScore: 76, createdAt: "2026-06-20" },
  { id: 7, emoji: "💉", title: "Protocolo Pre y Post Anestesia", area: "UCI", category: "Protocolos Clínicos", roles: ["Médico Veterinario", "Asistente Médico"], status: "draft", completions: 0, avgScore: 0, createdAt: "2026-07-14" },
  { id: 8, emoji: "🐈", title: "Manejo Felino y Reducción de Estrés", area: "Médica", category: "Protocolos Clínicos", roles: ["Todos"], status: "active", completions: 38, avgScore: 85, createdAt: "2026-07-06" },
];

const STAFF_DATA: StaffMember[] = [
  { id: 1, name: "Ana Rodríguez", initials: "AR", role: "Médico Veterinario", area: "UCI", pts: 4820, streak: 14, completions: 47, avgScore: 93, status: "active", gradientFrom: "#6366f1", gradientTo: "#8b5cf6", certs: ["Bioseg. I", "RCP Animal", "Anestesia"], hireDate: "2024-01-15" },
  { id: 2, name: "Carlos Méndez", initials: "CM", role: "Asistente Médico", area: "Médica", pts: 3910, streak: 9, completions: 38, avgScore: 88, status: "active", gradientFrom: "#10b981", gradientTo: "#059669", certs: ["Bioseg. I", "Cadena Frío"], hireDate: "2024-03-10" },
  { id: 3, name: "Valentina López", initials: "VL", role: "Groomer", area: "Peluquería", pts: 3450, streak: 7, completions: 31, avgScore: 85, status: "active", gradientFrom: "#f59e0b", gradientTo: "#d97706", certs: ["Bioseg. I", "Manejo Animal"], hireDate: "2024-02-20" },
  { id: 4, name: "Miguel Torres", initials: "MT", role: "Counter", area: "PetShop", pts: 1200, streak: 0, completions: 12, avgScore: 54, status: "risk", gradientFrom: "#ef4444", gradientTo: "#dc2626", certs: [], hireDate: "2026-06-01" },
  { id: 5, name: "Sofía Herrera", initials: "SH", role: "Jefe de Piso", area: "Operaciones", pts: 2980, streak: 5, completions: 29, avgScore: 79, status: "active", gradientFrom: "#3b82f6", gradientTo: "#2563eb", certs: ["Bioseg. II", "RCP Animal", "Cadena Frío"], hireDate: "2023-11-05" },
  { id: 6, name: "Diego Ramírez", initials: "DR", role: "Auxiliar", area: "UCI", pts: 980, streak: 0, completions: 9, avgScore: 48, status: "risk", gradientFrom: "#f97316", gradientTo: "#ea580c", certs: [], hireDate: "2026-07-01" },
  { id: 7, name: "Laura Castillo", initials: "LC", role: "Médico Veterinario", area: "Médica", pts: 4100, streak: 11, completions: 41, avgScore: 90, status: "active", gradientFrom: "#8b5cf6", gradientTo: "#7c3aed", certs: ["Bioseg. II", "RCP Animal", "Anestesia", "Cadena Frío"], hireDate: "2023-08-15" },
  { id: 8, name: "Pablo Nieto", initials: "PN", role: "Groomer", area: "Peluquería", pts: 2750, streak: 6, completions: 28, avgScore: 81, status: "active", gradientFrom: "#06b6d4", gradientTo: "#0891b2", certs: ["Bioseg. I"], hireDate: "2024-05-12" },
  { id: 9, name: "Daniela Mora", initials: "DM", role: "Counter", area: "Recepción", pts: 3200, streak: 8, completions: 34, avgScore: 86, status: "active", gradientFrom: "#ec4899", gradientTo: "#db2777", certs: ["Bioseg. I", "Manejo Animal"], hireDate: "2024-01-30" },
  { id: 10, name: "Andrés Silva", initials: "AS", role: "Auxiliar", area: "Operaciones", pts: 540, streak: 0, completions: 5, avgScore: 40, status: "inactive", gradientFrom: "#6b7280", gradientTo: "#4b5563", certs: [], hireDate: "2026-07-10" },
];

const INITIAL_PATHS: LearningPath[] = [
  {
    id: 1, title: "Inducción Médico Veterinario", role: "Médico Veterinario",
    description: "Ruta completa desde el primer día hasta especialización avanzada en 90 días.",
    color: "#4F46E5", icon: "🩺", duration: "90 días",
    stages: [
      { id: 1, period: "Día 1", title: "Inducción Clínica", modules: ["Bienvenida VetCenter", "Instalaciones y áreas", "Bioseguridad básica"] },
      { id: 2, period: "Semana 1", title: "Protocolos Base", modules: ["Sistema de Triaje", "RCP Canino", "RCP Felino", "Cadena de Frío"] },
      { id: 3, period: "Mes 1", title: "Procedimientos Clínicos", modules: ["Anestesia básica", "Pre/Post quirúrgico", "Farmacia y narcóticos", "UCI esencial"] },
      { id: 4, period: "Mes 3", title: "Especialización Avanzada", modules: ["UCI avanzado", "Cirugía menor", "Diagnóstico diferencial", "Casos clínicos reales"] },
    ],
    assignedStaff: [1, 7],
    tutorId: 7,
    hasFinalExam: true, passingScore: 80,
    examQuestions: [
      { id: 1, text: "¿Cuál es el primer paso al recibir un paciente en paro cardiorrespiratorio?", type: "multiple", options: ["Llamar al propietario","Iniciar RCP inmediatamente","Preparar medicación","Tomar signos vitales"], correct: 1, explanation: "La reanimación inmediata es prioritaria. Sin oxígeno, el daño cerebral ocurre en 4–6 minutos." },
      { id: 2, text: "¿A qué temperatura se almacenan las vacunas vivas atenuadas?", type: "multiple", options: ["0°C a 2°C","2°C a 8°C","10°C a 15°C","-20°C"], correct: 1, explanation: "La cadena de frío entre 2°C y 8°C garantiza la efectividad de las vacunas vivas." },
      { id: 3, text: "¿Qué documento se completa con doble firma al inicio de cada turno?", type: "multiple", options: ["Historia clínica","Control de narcóticos","Ficha de ingreso","Registro de temperatura"], correct: 1, explanation: "El libro de narcóticos requiere doble firma como medida de control y seguridad." },
      { id: 4, text: "La cadena de frío para vacunas se registra cada 4 horas.", type: "truefalse", options: ["Verdadero","Falso"], correct: 0, explanation: "Correcto. El registro cada 4h permite detectar desviaciones antes de que afecten las vacunas." },
      { id: 5, text: "En manejo felino F.A.S. nivel 5, ¿se puede forzar la sujeción si el paciente es urgente?", type: "truefalse", options: ["Verdadero","Falso"], correct: 1, explanation: "Nunca. F.A.S. 5 requiere sedación previa. Forzar la sujeción pone en riesgo al animal y al personal." },
    ],
    certTitle: "Certificado de Inducción Clínica", certSubtitle: "Médico Veterinario — VetCenter", certIssuer: "VetLearn Operations",
    createdAt: "2026-01-10",
  },
  {
    id: 2, title: "Groomer Certificado", role: "Groomer",
    description: "De técnicas básicas a groomer certificado en 90 días.",
    color: "#ec4899", icon: "✂️", duration: "90 días",
    stages: [
      { id: 1, period: "Día 1", title: "Área de Peluquería", modules: ["Instalaciones y equipos", "Seguridad animal", "Bioseguridad peluquería"] },
      { id: 2, period: "Semana 1", title: "Técnicas Básicas", modules: ["Baño y secado", "Cepillado por textura", "Identificación de piel"] },
      { id: 3, period: "Mes 1", title: "Cortes por Raza", modules: ["Razas populares caninas", "Razas felinas", "Tijera y máquina", "Acabados"] },
      { id: 4, period: "Mes 3", title: "Groomer Certificado", modules: ["Cortes de concurso", "Detección dermatológica", "Manejo paciente difícil"] },
    ],
    assignedStaff: [3, 8],
    tutorId: 5,
    hasFinalExam: true, passingScore: 75,
    examQuestions: [
      { id: 1, text: "¿A qué temperatura debe estar el agua para el baño de un perro?", type: "multiple", options: ["30-32°C","37-38°C","40-42°C","25-28°C"], correct: 1, explanation: "37-38°C es la temperatura ideal, similar a la corporal. Más de 40°C puede causar quemaduras." },
      { id: 2, text: "¿Qué producto se usa para desinfectar la mesa entre cada paciente?", type: "multiple", options: ["Alcohol 70%","Glutaraldehído 2%","Hipoclorito 1%","Agua con jabón"], correct: 1, explanation: "El glutaraldehído 2% con 5 minutos de contacto garantiza desinfección de alto nivel entre pacientes." },
      { id: 3, text: "Al ver piel enrojecida con descamación durante el baño, ¿qué haces?", type: "multiple", options: ["Continuar normalmente","Aplicar más champú","Detener y derivar al médico","Raspar la zona"], correct: 2, explanation: "Toda lesión dermatológica debe derivarse al área médica. Nunca tratar por cuenta propia." },
      { id: 4, text: "Para razas con doble capa como el Husky, ¿se puede rasurar el pelaje?", type: "truefalse", options: ["Verdadero","Falso"], correct: 1, explanation: "Nunca rasurar la doble capa. Protege de calor, frío y rayos UV. Solo cepillado profundo." },
    ],
    certTitle: "Groomer Certificado VetCenter", certSubtitle: "Peluquería Canina y Felina", certIssuer: "VetLearn Operations",
    createdAt: "2026-02-01",
  },
];

const INITIAL_CERTS: Certificate[] = [
  { id: 1, recipientName: "Ana Rodríguez", recipientRole: "Médico Veterinario", pathTitle: "Inducción Médico Veterinario", score: 94, date: "15 Mar 2026", issuer: "VetLearn Operations", certSubtitle: "Médico Veterinario — VetCenter" },
  { id: 2, recipientName: "Laura Castillo", recipientRole: "Médico Veterinario", pathTitle: "Inducción Médico Veterinario", score: 88, date: "22 Mar 2026", issuer: "VetLearn Operations", certSubtitle: "Médico Veterinario — VetCenter" },
  { id: 3, recipientName: "Valentina López", recipientRole: "Groomer", pathTitle: "Groomer Certificado", score: 91, date: "10 Abr 2026", issuer: "VetLearn Operations", certSubtitle: "Peluquería Canina y Felina" },
];

const HEATMAP_DATA = [
  { branch: "Sede Norte", protocols: [[92, 88, 95, 90, 87], [78, 65, 72, 68, 55], [85, 80, 88, 82, 79]] },
  { branch: "Sede Sur",   protocols: [[70, 72, 68, 75, 60], [45, 38, 52, 40, 35], [65, 60, 70, 58, 50]] },
  { branch: "Sede Centro",protocols: [[88, 90, 92, 85, 83], [80, 75, 82, 78, 70], [91, 88, 95, 87, 84]] },
  { branch: "Sede Este",  protocols: [[95, 92, 96, 91, 89], [82, 78, 85, 80, 76], [88, 85, 90, 82, 80]] },
];
const HEATMAP_PROTOCOLS = ["Recepción Urgencias", "Bioseguridad", "Control Inventario", "Entrega Turno", "Manejo UCI"];
const HEATMAP_SHIFTS = ["Turno Día", "Turno Noche", "Fin de Semana"];

const COMPLETION_DATA = [
  { day: "Lun", actual: 72, target: 80 }, { day: "Mar", actual: 85, target: 80 },
  { day: "Mié", actual: 78, target: 80 }, { day: "Jue", actual: 91, target: 80 },
  { day: "Vie", actual: 68, target: 80 }, { day: "Sáb", actual: 88, target: 80 },
  { day: "Dom", actual: 76, target: 80 },
];
const AREA_SCORES = [
  { area: "Médica", score: 87 }, { area: "UCI", score: 58 },
  { area: "Peluquería", score: 91 }, { area: "PetShop", score: 83 },
  { area: "Recepción", score: 79 }, { area: "Operaciones", score: 88 },
];
const PIE_DATA = [
  { name: "Emergencias", value: 22, color: "#ef4444" },
  { name: "Bioseguridad", value: 18, color: "#10b981" },
  { name: "Inventario", value: 15, color: "#3b82f6" },
  { name: "Clínicos", value: 25, color: "#8b5cf6" },
  { name: "Inducción", value: 12, color: "#f59e0b" },
  { name: "Normativa", value: 8, color: "#06b6d4" },
];

const CERT_TYPES = [
  { id: "bioseg1", name: "Bioseg. Nivel I", icon: "🛡️", months: 12 },
  { id: "bioseg2", name: "Bioseg. Nivel II", icon: "🛡️", months: 12 },
  { id: "rcp",     name: "RCP Animal",       icon: "❤️", months: 6  },
  { id: "frio",    name: "Cadena de Frío",   icon: "🌡️", months: 12 },
  { id: "anest",   name: "Anestesia",        icon: "💉", months: 24 },
  { id: "animal",  name: "Manejo Animal",    icon: "🐾", months: 12 },
];

const BADGES_DATA = [
  { id: 1, icon: "🔥", name: "Racha Imparable", desc: "7 días seguidos de retos", earned: 23, criteria: "Streak ≥ 7 días" },
  { id: 2, icon: "⭐", name: "Estrella de la Semana", desc: "Top 1 ranking semanal", earned: 8, criteria: "Rank #1 semanal" },
  { id: 3, icon: "🏆", name: "Maestro del Quiz", desc: "100% en 10 retos seguidos", earned: 5, criteria: "10 perfectos" },
  { id: 4, icon: "⚡", name: "Velocista", desc: "Reto completo en < 60s", earned: 34, criteria: "Tiempo < 60s" },
  { id: 5, icon: "🛡️", name: "Guardián Bioseguro", desc: "100% módulo bioseguridad", earned: 19, criteria: "Bioseg. completo" },
  { id: 6, icon: "🩺", name: "Experto Clínico", desc: "Promedio ≥ 95% en el mes", earned: 11, criteria: "Avg ≥ 95%" },
];

const REWARDS_DATA_INIT = [
  { id: 1, icon: "☕", name: "Café Gratis", cost: 200, stock: 10, redeemed: 23, active: true },
  { id: 2, icon: "🕐", name: "Salida 1h Antes", cost: 500, stock: 3, redeemed: 8, active: true },
  { id: 3, icon: "📚", name: "Curso Online", cost: 1000, stock: 5, redeemed: 3, active: true },
  { id: 4, icon: "🎽", name: "Uniforme Extra", cost: 300, stock: 20, redeemed: 15, active: false },
];

const PROTOCOLS_MEDICA = [
  { emoji: "🚨", title: "Sistema de Triaje", sub: "Colores rojo/amarillo/verde/negro", desc: "Clasificación inmediata de pacientes por severidad. Incluye criterios clínicos para cada nivel y tiempo máximo de atención.\n\n🔴 Rojo: Paro cardiorrespiratorio, shock, convulsiones activas. Atención < 5 min.\n🟡 Amarillo: Vómitos, fracturas, disnea leve. Atención < 30 min.\n🟢 Verde: Heridas superficiales, consultas rutina. Atención < 2h.\n⬛ Negro: Sin posibilidad de supervivencia.", updated: "15 Jul", tag: "Emergencias" },
  { emoji: "❤️", title: "RCP Canino y Felino", sub: "Protocolo completo paso a paso", desc: "1. Verificar inconsciencia y ausencia de respiración.\n2. Posición decúbito lateral derecho en superficie dura.\n3. Permeabilizar vía aérea — extensión de cuello, tracción lingual.\n4. Masaje cardíaco: 100-120 compresiones/min, profundidad 1/3 del tórax.\n5. Ventilación: 2 respiraciones cada 30 compresiones.\n6. Adrenalina 0.01 mg/kg IV si no responde en 3-5 min.", updated: "10 Jul", tag: "Emergencias" },
  { emoji: "💉", title: "Protocolo de Vacunación", sub: "Caninos, Felinos y Exóticos", desc: "Esquema de vacunación por edad, especie y riesgo epidemiológico.\n\n🐕 Caninos: Parvovirus, Moquillo, Adenovirus, Leptospira, Rabia.\n🐈 Felinos: Panleucopenia, Herpesvirus, Calicivirus, Leucemia Felina.\n\n⚠️ Cadena de frío 2°C-8°C obligatoria. Registro en historia clínica inmediato.", updated: "08 Jul", tag: "Preventiva" },
  { emoji: "🌡️", title: "Cadena de Frío", sub: "Vacunas y biológicos", desc: "Temperatura de almacenamiento 2°C–8°C.\n\n✅ Registro de temperatura cada 4h.\n✅ Alarma configurada a ±0.5°C del rango.\n✅ Plan de contingencia: traslado inmediato si > 8°C por más de 30 min.\n✅ Vacunas que salieron de rango NO se usan — descarte documentado.", updated: "12 Jul", tag: "Inventario" },
  { emoji: "😴", title: "Pre y Post Anestesia", sub: "Lista de verificación quirúrgica", desc: "PRE: Ayuno mínimo 8h (sólidos), 4h (líquidos). Evaluación ASA I–V. Premedición según protocolo del médico.\n\nINTRAPERATORIO: Monitoreo SpO2, FC, temperatura, presión.\n\nPOST: Temperatura > 37°C antes del alta. Analgesia multimodal. Control de náuseas.", updated: "05 Jul", tag: "Quirúrgico" },
  { emoji: "🔬", title: "Toma de Muestras Lab.", sub: "Sangre, orina y cultivos", desc: "Hemograma: Vena cefálica o yugular. Tubo EDTA (tapa morada).\nBioquímica: Tubo seco o SST (tapa roja). Centrifugar 10 min.\nUrioanálisis: Recolección limpia. Analizar < 1h.\nCultivos: Tubo estéril, hisopos culturette. Refrigeración inmediata.", updated: "02 Jul", tag: "Diagnóstico" },
  { emoji: "💊", title: "Manejo de Narcóticos", sub: "Control y registro obligatorio", desc: "⚖️ Doble conteo al inicio y fin de cada turno.\n📋 Registro en libro oficial con firma de dos personas.\n🔒 Caja con llave doble — médico + jefe de turno.\n🚨 Faltante: Notificación inmediata a gerencia y DIGEMID.", updated: "01 Jul", tag: "Farmacia" },
  { emoji: "🐈", title: "Manejo Felino Low-Stress", sub: "Técnica F.A.S. reducida", desc: "Fear, Anxiety, Stress (F.A.S.) scale 0-5.\n\n0-2: Manejo estándar con toalla.\n3-4: Feromonas Feliway® 15 min antes. Sala separada.\n5: Sedación previa. Nunca forzar sujeción en F.A.S. 5.\n\nNunca mirar directamente a los ojos. Dejar olfatear antes de tocar.", updated: "18 Jun", tag: "Bienestar" },
];
const PROTOCOLS_PELQUERIA = [
  { emoji: "✂️", title: "Cortes por Raza Canina", sub: "Guía visual de 30 razas", desc: "📐 Poodle: Corte continental o cachorro. Pompones en patas y cola.\n📐 Schnauzer: Cuerpo corto máquina #7, barba y cejas con tijera.\n📐 Bichón Frisé: Redondo total. Tijera curva para acabado.\n📐 Golden/Labrador: Cepillado profundo, tijera para patas y orejas.\n📐 Husky: Solo cepillado — NUNCA rasurar doble capa.", updated: "14 Jul", tag: "Técnico" },
  { emoji: "🛁", title: "Baño y Secado Profesional", sub: "Temperatura y productos correctos", desc: "🌡️ Temperatura del agua: 37-38°C. Nunca > 40°C.\n🧴 Champú: Piel normal (pH 7), sensible (pH 6.5), grasa (con azufre).\n💨 Secado: Temperatura media, movimiento constante. Distancia > 20 cm.\n\n⚠️ Braquicéfalos y cachorros: Calor bajo, supervisión constante.", updated: "11 Jul", tag: "Técnico" },
  { emoji: "🦠", title: "Bioseguridad en Peluquería", sub: "Desinfección entre pacientes", desc: "Entre cada paciente:\n✅ Limpiar y desinfectar mesa con glutaraldehído 2% (5 min contacto).\n✅ Limpiar tijeras y peines con alcohol 70%.\n✅ Cambiar toalla.\n✅ Lavado de manos con jabón antiséptico.\n\nSemanalmente: Limpieza profunda de bañera y secador.", updated: "09 Jul", tag: "Bioseguridad" },
  { emoji: "🔍", title: "Identificación de Dermatosis", sub: "Señales que NO debes ignorar", desc: "🔴 Derivación urgente: Alopecia multifocal, pústulas, costras, eritema generalizado, sangrado.\n🟡 Derivación rutina: Descamación leve, comedones, hiperpigmentación localizada.\n\n⚠️ NO aplicar productos sobre lesiones activas. Informar al propietario siempre.", updated: "06 Jul", tag: "Clínico" },
  { emoji: "🐾", title: "Manejo Animal Seguro", sub: "Contención sin daño", desc: "Señales de miedo: Cola baja, orejas atrás, temblor, jadeo excesivo, boca cerrada.\nSeñales de agresión: Gruñido, exposición de dientes, pelo erizado, rigidez.\n\n🛑 Si señales de agresión: Detener, bozal, notificar al médico.\n✅ Técnica de toalla para felinos. Nunca scruff en adultos.", updated: "03 Jul", tag: "Bienestar" },
  { emoji: "💅", title: "Corte de Uñas y Arreglo", sub: "Orejas, uñas y anal", desc: "🦶 Uñas: Cortar 2mm antes del quick. Uñas oscuras: cortes pequeños progresivos. Styptic powder ante sangrado.\n👂 Orejas: Limpieza con solución específica y algodón. NUNCA hisopos profundos.\n🔵 Glándulas anales: Solo expresión externa. Derivar si impactación.", updated: "01 Jul", tag: "Técnico" },
];
const PROTOCOLS_PETSHOP = [
  { emoji: "🥩", title: "Nutrición por Etapa de Vida", sub: "Cachorro, adulto, senior", desc: "🐶 Cachorro (< 12m): Alta proteína y calcio. Croquetas pequeñas.\n🐕 Adulto (1-7a): Mantenimiento calórico según actividad.\n🦮 Senior (> 7a): Bajo en fósforo, glucosamina, omega-3.\n\n⚠️ Razas gigantes: Fórmula específica. Nunca alimento para razas pequeñas.", updated: "13 Jul", tag: "Nutrición" },
  { emoji: "🐠", title: "Manejo de Animales Vivos", sub: "Peces, aves, reptiles", desc: "🐠 Peces: pH 7-7.5, temperatura especie-específica. Cuarentena 14 días antes de venta.\n🦜 Aves: Temperatura 22-28°C. Alimento fresco diario. Observar plumaje y deposiciones.\n🦎 Reptiles: Lámpara UV-B obligatoria. Temperatura gradiente.", updated: "10 Jul", tag: "Bienestar" },
  { emoji: "🏷️", title: "Lectura de Etiquetas", sub: "Ingredientes, garantizado y AAFCO", desc: "El primer ingrediente es el de mayor proporción.\n✅ Proteína animal como primer ingrediente = buena señal.\n✅ Declaración AAFCO: 'completo y balanceado' vs 'solo para suplementación'.\n⚠️ Conservantes: BHA/BHT evitar. Preferir vitamina E (tocoferoles) y C.", updated: "08 Jul", tag: "Nutrición" },
  { emoji: "🔄", title: "Devoluciones y Garantías", sub: "Protocolo de atención al cliente", desc: "1. Escuchar sin interrumpir. Agradecer el reporte.\n2. Verificar ticket de compra y estado del producto.\n3. < 7 días: Cambio o reembolso sin cuestionamiento.\n4. > 7 días: Evaluación de caso con supervisor.\n5. Documentar en sistema. Notificar a proveedor si defecto de fabricación.", updated: "05 Jul", tag: "Servicio" },
  { emoji: "🦠", title: "Bioseguridad PetShop", sub: "Prevención de zoonosis", desc: "Lavado de manos 30 segundos entre contacto con diferentes animales.\n🧤 Guantes para reptiles y aves (Salmonella).\n🧹 Limpieza de jaulas con desinfectante ambiental. Descanso 15 min antes de reagregar animal.\n⚠️ Embarazadas: No manipular tortugas (Salmonella), evitar toxoplasma.", updated: "02 Jul", tag: "Bioseguridad" },
  { emoji: "🌟", title: "Venta Consultiva", sub: "De vendedor a asesor", desc: "1. Saludo personalizado. Nunca '¿en qué le ayudo?'.\n2. Preguntas clave: especie, edad, condición, presupuesto.\n3. Recomendar máximo 2 opciones con diferencia clara.\n4. Mencionar beneficio principal, no características técnicas.\n5. Ofrecer complemento natural (no forzar).", updated: "29 Jun", tag: "Servicio" },
];

const CALENDAR_EVENTS: Record<number, { label: string; type: "quiz" | "cert" | "event" | "alert" }[]> = {
  1:  [{ label: "Reto: Triaje UCI", type: "quiz" }],
  3:  [{ label: "Bioseg. Nivel I — Vence (Diego R.)", type: "cert" }],
  7:  [{ label: "Semana de Bioseguridad 🛡️", type: "event" }, { label: "Reto: Cadena de Frío", type: "quiz" }],
  14: [{ label: "Reto: Nutrición PetShop", type: "quiz" }],
  15: [{ label: "RCP Animal — Vence (Miguel T.)", type: "cert" }],
  18: [{ label: "Jornada de Vacunación Masiva 🐕", type: "event" }],
  21: [{ label: "Reto: Protocolo Anestesia", type: "quiz" }],
  23: [{ label: "Entrega de Resultados Mensual", type: "event" }, { label: "🚨 Sede Sur - Cert. vence", type: "alert" }],
  25: [{ label: "Reto: Manejo Estrés Felino", type: "quiz" }],
  28: [{ label: "Simulacro de Emergencia", type: "event" }],
  30: [{ label: "Cierre de mes — Reportes", type: "event" }],
  31: [{ label: "Reto: Inducción Nuevos Ingresos", type: "quiz" }],
};

const EMPLOYEE_QUIZ = [
  { scenario: "🚨 Emergencia", emoji: "🐕", text: "Un Labrador ingresa sin respuesta. ¿Cuál es el primer paso?", options: ["Llamar al dueño", "Iniciar RCP inmediatamente", "Administrar adrenalina", "Verificar signos vitales"], correct: 1, explanation: "RCP inmediato. Sin oxígeno, el daño cerebral ocurre en 4–6 minutos." },
  { scenario: "🌡️ Cadena de Frío", emoji: "💊", text: "¿A qué temperatura se almacenan las vacunas vivas atenuadas?", options: ["0°C a 4°C", "2°C a 8°C", "15°C a 25°C", "-20°C"], correct: 1, explanation: "Las vacunas vivas se conservan entre 2°C y 8°C en cadena de frío continua." },
  { scenario: "✂️ Peluquería", emoji: "🐩", text: "Al bañar a un Poodle ves piel enrojecida con descamación. ¿Qué haces?", options: ["Continuar el baño normalmente", "Aplicar más champú para limpiar bien", "Detener, registrar y derivar al médico", "Raspar la zona para eliminar escamas"], correct: 2, explanation: "Toda lesión de piel debe derivarse al área médica. Nunca manipular ni tratar por cuenta propia." },
];

// ─── Modal Component ──────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className={`bg-[#141626] border border-white/10 rounded-2xl flex flex-col max-h-[90vh] ${wide ? "w-full max-w-5xl" : "w-full max-w-2xl"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6" style={{ scrollbarWidth: "none" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Certificate Preview ──────────────────────────────────────────────────────

function CertificatePreview({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-3xl">
        <button onClick={onClose} className="absolute -top-12 right-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <X className="w-4 h-4" /> Cerrar
        </button>
        {/* The actual certificate */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "1.414/1" }}>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-10"
            style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
            {/* Border decoration */}
            <div className="absolute inset-4 rounded-xl border-2 border-yellow-400/40 pointer-events-none" />
            <div className="absolute inset-6 rounded-lg border border-yellow-400/20 pointer-events-none" />
            {/* Stars decoration */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
            </div>
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">VetLearn Operations</p>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-6">Certificado de Logro</p>
            <p className="text-white/60 text-sm mb-1">Se certifica que</p>
            <h1 className="text-4xl font-bold text-white text-center mb-1" style={{ fontFamily: "serif" }}>{cert.recipientName}</h1>
            <p className="text-indigo-300 text-sm mb-5">{cert.recipientRole}</p>
            <p className="text-white/60 text-sm mb-2">ha completado satisfactoriamente</p>
            <h2 className="text-xl font-bold text-yellow-400 text-center mb-1">{cert.pathTitle}</h2>
            <p className="text-white/50 text-xs mb-6">{cert.certSubtitle}</p>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold">Aprobado con {cert.score}%</span>
            </div>
            <div className="flex items-end justify-between w-full mt-auto">
              <div className="text-center">
                <div className="h-px w-32 bg-white/30 mb-1" />
                <p className="text-white/40 text-xs">Firma del Director</p>
              </div>
              <div className="text-center">
                <p className="text-white/50 text-xs">Emitido el {cert.date}</p>
                <p className="text-white/30 text-xs">ID: CERT-{String(cert.id).padStart(5, "0")}</p>
              </div>
              <div className="text-center">
                <div className="h-px w-32 bg-white/30 mb-1" />
                <p className="text-white/40 text-xs">{cert.issuer}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 justify-center">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-xl font-semibold transition-colors">
            <Download className="w-4 h-4" /> Descargar PDF
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-5 py-2 rounded-xl transition-colors">
            <Send className="w-4 h-4" /> Enviar por Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Av({ initials, from, to, size = "md" }: { initials: string; from: string; to: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg", xl: "w-20 h-20 text-2xl" }[size];
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      {initials}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const s: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    scheduled: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    archived: "bg-slate-600/20 text-slate-500 border-slate-600/30",
    risk: "bg-red-500/20 text-red-400 border-red-500/30",
    inactive: "bg-slate-600/20 text-slate-500 border-slate-600/30",
    done: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  const l: Record<string, string> = { active: "Activo", draft: "Borrador", scheduled: "Programado", archived: "Archivado", risk: "En Riesgo", inactive: "Inactivo", done: "Completado" };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${s[status] || s.draft}`}>{l[status] || status}</span>;
}

function AreaBadge({ area }: { area: string }) {
  const c = AREA_COLOR[area] || "#64748b";
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: c, borderColor: `${c}40`, background: `${c}18` }}>{area}</span>;
}

function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div><p className="text-sm text-white font-medium">{label}</p>{desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}</div>
      <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-indigo-500" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function KpiCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <div className={`${color} border border-white/10 rounded-2xl p-5`}>
      <div className="flex items-start justify-between mb-3">{icon}<span className="text-xs text-slate-500 font-medium">{sub}</span></div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-slate-300 mt-1 font-medium">{label}</p>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardView({ setView }: { setView: (v: View) => void }) {
  const newHires = STAFF_DATA.filter(s => s.hireDate >= "2026-06-01");
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
          <p className="text-sm text-slate-500 mt-0.5">Jueves, 23 de Julio 2026 · VetCenter · 150 colaboradores</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("quiz-builder")} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors">
            <Plus className="w-4 h-4" /> Nuevo Reto
          </button>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm px-4 py-2 rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Personal Activo" value="143/150" sub="95% presencia hoy" color="bg-indigo-500/10" icon={<Users className="w-5 h-5 text-indigo-400" />} />
        <KpiCard label="Promedio Global" value="81%" sub="+3% vs semana pasada" color="bg-emerald-500/10" icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
        <KpiCard label="Completación Hoy" value="76%" sub="114 de 150 completaron" color="bg-amber-500/10" icon={<Target className="w-5 h-5 text-amber-400" />} />
        <KpiCard label="Sedes en Riesgo" value="1" sub="Sede Sur — Turno Noche" color="bg-red-500/10" icon={<AlertTriangle className="w-5 h-5 text-red-400" />} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Completación Esta Semana vs Meta</h3>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={COMPLETION_DATA}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} name="Meta" />
              <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={2} fill="url(#g1)" dot={{ fill: "#4F46E5", r: 3 }} name="Completación" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Score por Área Operativa</h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={AREA_SCORES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis dataKey="area" type="category" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {AREA_SCORES.map((e, i) => <Cell key={`s-${i}`} fill={e.score < 65 ? "#ef4444" : e.score < 80 ? "#f59e0b" : "#10b981"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5 space-y-2">
          <h3 className="text-sm font-semibold text-white mb-3">Alertas Operativas</h3>
          {[
            { sev: "critical", msg: "Sede Sur — T.Noche: 38% promedio en triaje", time: "hace 12 min" },
            { sev: "warning", msg: "2 certificaciones RCP vencen esta semana", time: "hace 1h" },
            { sev: "warning", msg: "UCI: 4 empleados sin completar protocolo", time: "hace 2h" },
            { sev: "success", msg: "Peluquería 91% completación — récord 🎉", time: "hace 3h" },
          ].map((a, i) => (
            <div key={i} className={`rounded-xl p-3 flex items-start gap-2.5 border-l-4 ${a.sev === "critical" ? "bg-red-500/8 border-red-500" : a.sev === "warning" ? "bg-amber-500/8 border-amber-500" : "bg-emerald-500/8 border-emerald-500"}`}>
              {a.sev === "critical" ? <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> : a.sev === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
              <div><p className="text-xs text-slate-200">{a.msg}</p><p className="text-xs text-slate-500 mt-0.5">{a.time}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Nuevos Ingresos ({newHires.length})</h3>
            <button onClick={() => setView("learning-paths")} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Ver rutas →</button>
          </div>
          <div className="space-y-3">
            {newHires.map(s => {
              const pct = Math.min(100, s.completions * 6);
              return (
                <div key={s.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                    <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white truncate">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div>
                    <span className="text-xs font-bold text-slate-300">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full ml-10"><div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Acciones Rápidas</h3>
          <div className="space-y-2">
            {[
              { label: "Nuevo Reto", icon: <Plus className="w-4 h-4" />, view: "quiz-builder" as View, color: "bg-[#4F46E5]/20 border-[#4F46E5]/30 text-indigo-300 hover:bg-[#4F46E5]/30" },
              { label: "Crear Ruta de Aprendizaje", icon: <Layers className="w-4 h-4" />, view: "learning-paths" as View, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20" },
              { label: "Ver Rankings", icon: <Trophy className="w-4 h-4" />, view: "gamification" as View, color: "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20" },
              { label: "Mapa de Riesgo", icon: <Map className="w-4 h-4" />, view: "heatmap" as View, color: "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" },
            ].map(a => (
              <button key={a.label} onClick={() => setView(a.view)} className={`w-full flex items-center gap-3 border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${a.color}`}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz List ────────────────────────────────────────────────────────────────

function QuizListView({ quizzes, setQuizzes, setView }: { quizzes: Quiz[]; setQuizzes: (q: Quiz[]) => void; setView: (v: View) => void }) {
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [previewQ, setPreviewQ] = useState<Quiz | null>(null);

  const filtered = quizzes.filter(q => {
    const ms = q.title.toLowerCase().includes(search.toLowerCase());
    const ma = filterArea === "all" || q.area === filterArea;
    const mst = filterStatus === "all" || q.status === filterStatus;
    return ms && ma && mst;
  });

  function copyQuiz(q: Quiz) {
    const copy: Quiz = { ...q, id: Date.now(), title: `${q.title} (copia)`, status: "draft", completions: 0, avgScore: 0, createdAt: new Date().toISOString().split("T")[0] };
    setQuizzes([copy, ...quizzes]);
  }
  function archiveQuiz(id: number) {
    setQuizzes(quizzes.map(q => q.id === id ? { ...q, status: "archived" } : q));
  }
  function deleteQuiz(id: number) {
    setQuizzes(quizzes.filter(q => q.id !== id));
  }

  return (
    <div className="p-6 space-y-5">
      {previewQ && (
        <Modal title={`Vista Previa — ${previewQ.title}`} onClose={() => setPreviewQ(null)}>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-600/25 to-violet-800/25 border border-indigo-500/20 rounded-2xl p-5">
              <span className="text-5xl block mb-2">{previewQ.emoji}</span>
              <h3 className="text-lg font-bold text-white">{previewQ.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{previewQ.category}</p>
              <div className="flex gap-2 mt-3"><AreaBadge area={previewQ.area} /><StatusChip status={previewQ.status} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[["Área", previewQ.area], ["Roles", previewQ.roles.join(", ")], ["Completaciones", `${previewQ.completions}`], ["Score prom.", previewQ.avgScore > 0 ? `${previewQ.avgScore}%` : "—"], ["Creado", previewQ.createdAt], ["Estado", previewQ.status]].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-xl p-3"><p className="text-xs text-slate-500">{k}</p><p className="text-sm font-semibold text-white mt-0.5">{v}</p></div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Retos & Cuestionarios</h1><p className="text-sm text-slate-500 mt-0.5">{quizzes.length} retos creados</p></div>
        <button onClick={() => setView("quiz-builder")} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Reto
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: quizzes.length, color: "text-white" },
          { label: "Activos", value: quizzes.filter(q => q.status === "active").length, color: "text-emerald-400" },
          { label: "Borradores", value: quizzes.filter(q => q.status === "draft").length, color: "text-slate-400" },
          { label: "Completaciones totales", value: quizzes.reduce((a, q) => a + q.completions, 0), color: "text-indigo-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#141626] border border-white/10 rounded-xl px-4 py-3">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar retos..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
        </div>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 outline-none">
          <option value="all">Todas las áreas</option>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 outline-none">
          <option value="all">Todos los estados</option>
          {["active","draft","scheduled","archived"].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      <div className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/8">
            {["Reto", "Área", "Estado", "Completaciones", "Score Avg", "Acciones"].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{q.emoji}</span>
                    <div><p className="text-sm font-medium text-white">{q.title}</p><p className="text-xs text-slate-500">{q.category}</p></div>
                  </div>
                </td>
                <td className="px-5 py-3.5"><AreaBadge area={q.area} /></td>
                <td className="px-5 py-3.5"><StatusChip status={q.status} /></td>
                <td className="px-5 py-3.5"><p className="text-sm font-semibold text-white">{q.completions}</p></td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-bold ${q.avgScore >= 80 ? "text-emerald-400" : q.avgScore >= 60 ? "text-amber-400" : q.avgScore > 0 ? "text-red-400" : "text-slate-600"}`}>
                    {q.avgScore > 0 ? `${q.avgScore}%` : "—"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setView("quiz-builder")} title="Editar" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setPreviewQ(q)} title="Vista previa" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => copyQuiz(q)} title="Duplicar" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    {q.status !== "archived"
                      ? <button onClick={() => archiveQuiz(q.id)} title="Archivar" className="p-1.5 rounded-lg hover:bg-amber-500/15 text-slate-400 hover:text-amber-400 transition-colors"><Archive className="w-3.5 h-3.5" /></button>
                      : <button onClick={() => deleteQuiz(q.id)} title="Eliminar" className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Quiz Builder ─────────────────────────────────────────────────────────────

function QuizBuilderView({ onSave }: { onSave: (q: Quiz) => void }) {
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<BuilderInfo>({ title: "", description: "", area: "Médica", category: "Emergencias", roles: [], shift: "Todos", emoji: "🐕" });
  const [questions, setQuestions] = useState<BuilderQuestion[]>([
    { id: 1, type: "multiple", scenario: "", emoji: "🐕", text: "", options: ["", "", "", ""], correct: 0, explanation: "" },
  ]);
  const [settings, setSettings] = useState<BuilderSettings>({ ptsPerQ: 50, timePerQ: 30, pubType: "immediate", pubDate: "", pubTime: "", frequency: "Diario", requireSignature: false, sendNotif: true, hideAnswers: false });
  const [published, setPublished] = useState(false);

  const EMOJIS = ["🐕","🐈","🚨","💊","🧤","🔬","✂️","🛒","📦","🏥","💉","🌡️","🦜","🐇","🩺","🧪"];
  const steps = ["Información", "Preguntas", "Configuración", "Vista Previa"];

  function addQ() { setQuestions(p => [...p, { id: Date.now(), type: "multiple", scenario: "", emoji: "🐕", text: "", options: ["","","",""], correct: 0, explanation: "" }]); }
  function updQ(id: number, f: keyof BuilderQuestion, v: unknown) { setQuestions(p => p.map(q => q.id === id ? { ...q, [f]: v } : q)); }
  function updOpt(qId: number, idx: number, val: string) {
    setQuestions(p => p.map(q => { if (q.id !== qId) return q; const opts = [...q.options]; opts[idx] = val; return { ...q, options: opts }; }));
  }
  function removeQ(id: number) { if (questions.length > 1) setQuestions(p => p.filter(q => q.id !== id)); }
  function toggleRole(role: string) {
    if (role === "Todos") { setInfo(p => ({ ...p, roles: p.roles.includes("Todos") ? [] : ["Todos"] })); return; }
    setInfo(p => { const wo = p.roles.filter(r => r !== "Todos"); return { ...p, roles: wo.includes(role) ? wo.filter(r => r !== role) : [...wo, role] }; });
  }
  const canAdvance = () => { if (step === 0) return info.title.trim().length > 0; if (step === 1) return questions.every(q => q.text.trim().length > 0); return true; };
  function publish(status: "active" | "draft") {
    onSave({ id: Date.now(), emoji: info.emoji, title: info.title || "Nuevo Reto", area: info.area, category: info.category, roles: info.roles.length ? info.roles : ["Todos"], status, completions: 0, avgScore: 0, createdAt: new Date().toISOString().split("T")[0] });
    setPublished(true);
  }
  const totalPts = questions.length * settings.ptsPerQ;
  const estTime = Math.ceil(questions.length * settings.timePerQ / 60);

  if (published) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="text-7xl">🎉</div>
        <h2 className="text-2xl font-bold text-white">¡Reto publicado con éxito!</h2>
        <p className="text-slate-400">El reto ya está disponible para los colaboradores asignados.</p>
        <button onClick={() => setPublished(false)} className="bg-[#4F46E5] hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">Crear otro reto</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white flex-1">Constructor de Retos</h1>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {steps.map((s, i) => (
            <button key={s} onClick={() => i <= step ? setStep(i) : null}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${step === i ? "bg-[#4F46E5] text-white" : i < step ? "text-emerald-400" : "text-slate-500"}`}>
              {i < step ? "✓ " : ""}{s}
            </button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Ícono del Reto</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setInfo(p => ({ ...p, emoji: e }))}
                    className={`w-10 h-10 rounded-xl text-xl transition-all ${info.emoji === e ? "bg-indigo-500 ring-2 ring-indigo-400" : "bg-white/5 hover:bg-white/10"}`}>{e}</button>
                ))}
              </div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Título *</label>
              <input value={info.title} onChange={e => setInfo(p => ({ ...p, title: e.target.value }))} placeholder="ej. Protocolo de Triaje Urgencias"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Descripción</label>
              <textarea value={info.description} onChange={e => setInfo(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="¿Qué aprenderá el colaborador?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Área</label>
                <select value={info.area} onChange={e => setInfo(p => ({ ...p, area: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                  {AREAS.map(a => <option key={a} value={a} className="bg-[#141626]">{a}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Categoría</label>
                <select value={info.category} onChange={e => setInfo(p => ({ ...p, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                  {["Emergencias","Bioseguridad","Inventario","Atención al Cliente","Protocolos Clínicos","Inducción","Normativa"].map(c => <option key={c} value={c} className="bg-[#141626]">{c}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Roles Objetivo</label>
              <div className="grid grid-cols-2 gap-2">
                {["Todos", ...ROLES].map(r => (
                  <button key={r} onClick={() => toggleRole(r)}
                    className={`text-left px-3 py-2 rounded-xl text-sm border transition-all ${info.roles.includes(r) ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vista Previa</label>
            <div className="bg-gradient-to-br from-indigo-600/30 to-violet-800/30 border border-indigo-500/20 rounded-2xl p-5">
              <span className="text-5xl">{info.emoji}</span>
              <h3 className="text-lg font-bold text-white mt-3">{info.title || "Título del Reto"}</h3>
              <p className="text-sm text-slate-400 mt-1">{info.description || "Descripción..."}</p>
              <div className="flex flex-wrap gap-2 mt-3"><AreaBadge area={info.area} /></div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="bg-[#141626] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-indigo-400">Pregunta {qi + 1}</span>
                <div className="flex items-center gap-2">
                  <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 gap-0.5">
                    {(["multiple","truefalse"] as const).map(t => (
                      <button key={t} onClick={() => updQ(q.id, "type", t)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${q.type === t ? "bg-indigo-500 text-white" : "text-slate-400"}`}>
                        {t === "multiple" ? "Opción Múltiple" : "V / F"}
                      </button>
                    ))}
                  </div>
                  {questions.length > 1 && <button onClick={() => removeQ(q.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
              <input value={q.scenario} onChange={e => updQ(q.id, "scenario", e.target.value)} placeholder="Contexto / Escenario"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-indigo-300 placeholder-slate-600 focus:border-indigo-500 outline-none mb-3" />
              <textarea value={q.text} onChange={e => updQ(q.id, "text", e.target.value)} rows={2} placeholder="Escribe la pregunta aquí..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none resize-none mb-3" />
              <div className="space-y-2 mb-3">
                {(q.type === "truefalse" ? ["Verdadero", "Falso"] : q.options).map((opt, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${q.correct === i ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/10 bg-white/3"}`}>
                    <button onClick={() => updQ(q.id, "correct", i)}
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correct === i ? "border-emerald-500 bg-emerald-500" : "border-slate-500 hover:border-emerald-500"}`}>
                      {q.correct === i && <span className="text-white text-xs">✓</span>}
                    </button>
                    {q.type === "truefalse"
                      ? <span className="text-sm text-slate-300">{opt}</span>
                      : <input value={opt} onChange={e => updOpt(q.id, i, e.target.value)} placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                          className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none" />}
                    {q.correct === i && <span className="text-xs text-emerald-400 font-semibold ml-auto">✓ Correcta</span>}
                  </div>
                ))}
              </div>
              <input value={q.explanation} onChange={e => updQ(q.id, "explanation", e.target.value)} placeholder="Explicación de la respuesta correcta"
                className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2 text-sm text-amber-200 placeholder-amber-800 focus:border-amber-500/50 outline-none" />
            </div>
          ))}
          <button onClick={addQ} className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 text-sm font-medium transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Agregar Pregunta
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-5">
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Puntos por Pregunta</label>
              <div className="flex gap-2">{[10,25,50,100].map(v => (
                <button key={v} onClick={() => setSettings(p => ({ ...p, ptsPerQ: v }))}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${settings.ptsPerQ === v ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}>{v} pts</button>
              ))}</div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Tiempo por Pregunta</label>
              <div className="flex gap-2">{[15,30,45,60].map(v => (
                <button key={v} onClick={() => setSettings(p => ({ ...p, timePerQ: v }))}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${settings.timePerQ === v ? "bg-amber-500 border-amber-500 text-black" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}>{v}s</button>
              ))}</div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Publicación</label>
              {[{ v: "immediate", label: "Publicar ahora" }, { v: "scheduled", label: "Programar fecha" }, { v: "recurring", label: "Recurrente" }].map(o => (
                <button key={o.v} onClick={() => setSettings(p => ({ ...p, pubType: o.v as BuilderSettings["pubType"] }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left transition-all ${settings.pubType === o.v ? "bg-indigo-500/15 border-indigo-500/40" : "bg-white/3 border-white/10 hover:border-white/20"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${settings.pubType === o.v ? "border-indigo-400 bg-indigo-500" : "border-slate-500"}`} />
                  <span className="text-sm font-medium text-white">{o.label}</span>
                </button>
              ))}
            </div>
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <Toggle value={settings.requireSignature} onChange={v => setSettings(p => ({ ...p, requireSignature: v }))} label="Requiere firma digital" />
              <Toggle value={settings.sendNotif} onChange={v => setSettings(p => ({ ...p, sendNotif: v }))} label="Enviar notificación push" />
              <Toggle value={settings.hideAnswers} onChange={v => setSettings(p => ({ ...p, hideAnswers: v }))} label="Ocultar respuestas hasta completar" />
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-indigo-300 mb-4">Resumen</h3>
            {[["Preguntas", questions.length], ["Puntos totales", `${totalPts} pts`], ["Tiempo estimado", `${estTime} min`]].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-400">{k}</span><span className="text-sm font-bold text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Así lo verá el colaborador</h3>
            <div className="bg-gradient-to-br from-rose-500/80 to-orange-600 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-5xl opacity-25">{info.emoji}</div>
              <div className="relative">
                <div className="flex gap-2 mb-2">
                  <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full">RETO DEL DÍA</span>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">⏱ {estTime} min</span>
                </div>
                <h3 className="text-white font-bold text-base">{info.title || "Título del reto"}</h3>
                <p className="text-orange-100 text-xs mt-1">{info.area} · {questions.length} preguntas</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-white text-orange-600 font-bold text-sm px-3 py-1.5 rounded-xl">Comenzar <span className="text-emerald-600">+{totalPts} pts</span></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
              {[["Título", info.title || "Sin título"], ["Área", info.area], ["Roles", info.roles.join(", ") || "Todos"], ["Preguntas", questions.length], ["Puntos", `${totalPts} pts`], ["Tiempo", `${estTime} min`]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-500">{k}</span><span className="text-xs font-semibold text-slate-200">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => publish("active")} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm">
              🚀 Publicar Reto
            </button>
            <button onClick={() => publish("draft")} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium py-3 rounded-2xl transition-colors text-sm">
              Guardar como Borrador
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-5 border-t border-white/8">
        <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm font-medium disabled:opacity-30 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        {step < 3 && (
          <button onClick={() => canAdvance() && setStep(s => s + 1)} disabled={!canAdvance()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold disabled:opacity-30 hover:bg-indigo-500 transition-colors">
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function HeatmapView() {
  const [selProto, setSelProto] = useState(0);
  const [selCell, setSelCell] = useState<{ b: number; s: number } | null>(null);
  const heat = (score: number) => score >= 85 ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : score >= 70 ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-red-500/20 border-red-500/40 text-red-400";
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Mapa de Riesgo Operativo</h1><p className="text-sm text-slate-500 mt-0.5">Dominio de protocolos por sede y turno</p></div>
        <select value={selProto} onChange={e => setSelProto(+e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none">
          {HEATMAP_PROTOCOLS.map((p, i) => <option key={i} value={i} className="bg-[#141626]">{p}</option>)}
        </select>
      </div>
      <div className="flex gap-4 text-xs">
        {[["bg-emerald-400","≥ 85% Dominio sólido"],["bg-amber-400","70–84% Refuerzo recomendado"],["bg-red-400","< 70% Intervención crítica"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-slate-400"><div className={`w-3 h-3 rounded-full ${c}`} />{l}</div>
        ))}
      </div>
      <div className="bg-[#141626] border border-white/10 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead><tr>
            <th className="text-left text-slate-400 text-xs font-semibold pb-3 pr-6">Sede</th>
            {HEATMAP_SHIFTS.map(s => <th key={s} className="text-center text-slate-400 text-xs font-semibold pb-3 px-2">{s}</th>)}
          </tr></thead>
          <tbody>
            {HEATMAP_DATA.map((row, bi) => (
              <tr key={row.branch}>
                <td className="text-white text-sm font-semibold pr-6 py-1.5 whitespace-nowrap">{row.branch}</td>
                {HEATMAP_SHIFTS.map((_, si) => {
                  const score = row.protocols[si][selProto];
                  const active = selCell?.b === bi && selCell?.s === si;
                  return (
                    <td key={si} className="px-1.5 py-1.5">
                      <button onClick={() => setSelCell(active ? null : { b: bi, s: si })}
                        className={`w-full rounded-xl border py-3 px-2 text-center transition-all hover:scale-105 ${heat(score)} ${active ? "ring-2 ring-white/30 scale-105" : ""}`}>
                        <p className="text-base font-extrabold">{score}%</p>
                        <p className="text-xs opacity-60">{score >= 85 ? "OK" : score >= 70 ? "Alerta" : "Crítico"}</p>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selCell && (
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{HEATMAP_DATA[selCell.b].branch} · {HEATMAP_SHIFTS[selCell.s]}</h3>
            <button onClick={() => setSelCell(null)} className="text-slate-500 hover:text-white text-xs transition-colors">Cerrar ✕</button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {HEATMAP_PROTOCOLS.map((p, i) => {
              const s = HEATMAP_DATA[selCell.b].protocols[selCell.s][i];
              return <div key={p} className={`rounded-xl border p-3 ${heat(s)}`}><p className="text-xs font-medium leading-tight mb-1">{p}</p><p className="text-xl font-extrabold">{s}%</p></div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Staff ────────────────────────────────────────────────────────────────────

function StaffView() {
  const [staff, setStaff] = useState(STAFF_DATA);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: ROLES[0], area: AREAS[0], hireDate: "" });

  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));

  function addStaff() {
    if (!newStaff.name.trim()) return;
    const initials = newStaff.name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
    const colors = [["#6366f1","#8b5cf6"],["#10b981","#059669"],["#f59e0b","#d97706"],["#3b82f6","#2563eb"],["#ec4899","#db2777"]];
    const [from, to] = colors[Math.floor(Math.random() * colors.length)];
    setStaff(prev => [...prev, { id: Date.now(), name: newStaff.name, initials, role: newStaff.role, area: newStaff.area, pts: 0, streak: 0, completions: 0, avgScore: 0, status: "inactive" as const, gradientFrom: from, gradientTo: to, certs: [], hireDate: newStaff.hireDate || new Date().toISOString().split("T")[0] }]);
    setNewStaff({ name: "", role: ROLES[0], area: AREAS[0], hireDate: "" });
    setShowAdd(false);
  }

  return (
    <div className="p-6 space-y-5">
      {showAdd && (
        <Modal title="Agregar Colaborador" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Nombre completo *</label>
              <input value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))} placeholder="ej. María García"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Rol</label>
                <select value={newStaff.role} onChange={e => setNewStaff(p => ({ ...p, role: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                  {ROLES.map(r => <option key={r} value={r} className="bg-[#141626]">{r}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Área</label>
                <select value={newStaff.area} onChange={e => setNewStaff(p => ({ ...p, area: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                  {AREAS.map(a => <option key={a} value={a} className="bg-[#141626]">{a}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Fecha de ingreso</label>
              <input type="date" value={newStaff.hireDate} onChange={e => setNewStaff(p => ({ ...p, hireDate: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" />
            </div>
            <button onClick={addStaff} disabled={!newStaff.name.trim()} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors">
              Agregar Colaborador
            </button>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Colaboradores</h1><p className="text-sm text-slate-500 mt-0.5">{staff.length} empleados registrados</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors"><Plus className="w-4 h-4" />Nuevo Colaborador</button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Activos", value: staff.filter(s => s.status === "active").length, color: "text-emerald-400" },
          { label: "En Riesgo", value: staff.filter(s => s.status === "risk").length, color: "text-red-400" },
          { label: "Nuevos Ingresos", value: staff.filter(s => s.hireDate >= "2026-06-01").length, color: "text-amber-400" },
          { label: "Sin Certificaciones", value: staff.filter(s => s.certs.length === 0).length, color: "text-slate-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#141626] border border-white/10 rounded-xl px-4 py-3">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, rol o área..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
      </div>
      <div className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/8">
            {["Colaborador","Área","Puntos","Racha","Score","Certificaciones","Estado",""].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <React.Fragment key={s.id}>
                <tr className={`border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${expanded === s.id ? "bg-white/3" : ""}`} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-3"><Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" /><div><p className="text-sm font-medium text-white">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div></div></td>
                  <td className="px-4 py-3.5"><AreaBadge area={s.area} /></td>
                  <td className="px-4 py-3.5"><span className="text-sm font-bold text-white font-mono">{s.pts.toLocaleString()}</span></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1"><span className="text-amber-400 text-base">🔥</span><span className="text-sm font-bold text-amber-400">{s.streak}d</span></div></td>
                  <td className="px-4 py-3.5"><span className={`text-sm font-bold ${s.avgScore >= 80 ? "text-emerald-400" : s.avgScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{s.avgScore}%</span></td>
                  <td className="px-4 py-3.5"><div className="flex gap-1 flex-wrap max-w-48">{s.certs.length > 0 ? s.certs.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">{c}</span>) : <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Sin certs</span>}</div></td>
                  <td className="px-4 py-3.5"><StatusChip status={s.status} /></td>
                  <td className="px-4 py-3.5"><ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded === s.id ? "rotate-180" : ""}`} /></td>
                </tr>
                {expanded === s.id && (
                  <tr className="border-b border-white/5 bg-white/2">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { label: "Completaciones", val: s.completions, show: String(s.completions) },
                          { label: "Score", val: s.avgScore, show: `${s.avgScore}%` },
                          { label: "XP Progress", val: Math.min(100, s.pts / 50), show: `${Math.min(100, Math.round(s.pts / 50))}%` },
                          { label: "Racha", val: Math.min(100, s.streak * 5), show: `${s.streak} días` },
                          { label: "Certificaciones", val: Math.min(100, s.certs.length * 25), show: `${s.certs.length} / 6` },
                        ].map(m => (
                          <div key={m.label}>
                            <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">{m.label}</span><span className="text-white font-medium">{m.show}</span></div>
                            <div className="h-1.5 bg-white/10 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(m.val / 100) * 100}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Gamification ─────────────────────────────────────────────────────────────

function GamificationView() {
  const [tab, setTab] = useState<"ranking" | "badges">("ranking");
  const [rewards, setRewards] = useState(REWARDS_DATA_INIT);
  const [showAddReward, setShowAddReward] = useState(false);
  const [newReward, setNewReward] = useState({ icon: "🎁", name: "", cost: 200, stock: 10 });

  const sorted = [...STAFF_DATA].sort((a, b) => b.pts - a.pts);
  const top3 = sorted.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumH = ["h-20", "h-28", "h-14"];
  const podiumBadge = ["🥈", "🥇", "🥉"];

  function addReward() {
    if (!newReward.name.trim()) return;
    setRewards(prev => [...prev, { id: Date.now(), ...newReward, redeemed: 0, active: true }]);
    setNewReward({ icon: "🎁", name: "", cost: 200, stock: 10 });
    setShowAddReward(false);
  }
  function toggleReward(id: number) { setRewards(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r)); }

  return (
    <div className="p-6 space-y-5">
      {showAddReward && (
        <Modal title="Nueva Recompensa" onClose={() => setShowAddReward(false)}>
          <div className="space-y-4">
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Ícono</label>
              <div className="flex flex-wrap gap-2">
                {["🎁","☕","🕐","📚","🎽","🏆","🎫","🍕","🎮","💆"].map(e => (
                  <button key={e} onClick={() => setNewReward(p => ({ ...p, icon: e }))}
                    className={`w-10 h-10 rounded-xl text-xl transition-all ${newReward.icon === e ? "bg-indigo-500 ring-2 ring-indigo-400" : "bg-white/5 hover:bg-white/10"}`}>{e}</button>
                ))}
              </div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Nombre *</label>
              <input value={newReward.name} onChange={e => setNewReward(p => ({ ...p, name: e.target.value }))} placeholder="ej. Almuerzo gratis"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Costo (monedas)</label>
                <input type="number" value={newReward.cost} onChange={e => setNewReward(p => ({ ...p, cost: +e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" />
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Stock inicial</label>
                <input type="number" value={newReward.stock} onChange={e => setNewReward(p => ({ ...p, stock: +e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" />
              </div>
            </div>
            <button onClick={addReward} disabled={!newReward.name.trim()} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors">Crear Recompensa</button>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Gamificación</h1><p className="text-sm text-slate-500 mt-0.5">Rankings, medallas y recompensas</p></div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          {(["ranking", "badges"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:text-white"}`}>
              {t === "ranking" ? "🏆 Ranking" : "🏅 Medallas"}
            </button>
          ))}
        </div>
      </div>

      {tab === "ranking" && (
        <div className="space-y-5">
          <div className="flex items-end justify-center gap-5 py-4">
            {podiumOrder.map((s, i) => s && (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{podiumBadge[i]}</span>
                <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="lg" />
                <p className="text-white text-sm font-semibold text-center">{s.name.split(" ")[0]}</p>
                <div className={`w-24 ${podiumH[i]} rounded-t-xl flex items-end justify-center pb-2 ${i === 1 ? "bg-amber-500/25" : "bg-white/10"}`}>
                  <span className={`font-bold text-sm ${i === 1 ? "text-amber-400" : "text-slate-300"}`}>{s.pts.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/8">{["#","Colaborador","Área","Puntos","Racha","Score"].map(h => <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>)}</tr></thead>
              <tbody>{sorted.map((s, i) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3"><span className="text-sm font-bold text-slate-400">#{i + 1}</span></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" /><div><p className="text-sm font-medium text-white">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div></div></td>
                  <td className="px-5 py-3"><AreaBadge area={s.area} /></td>
                  <td className="px-5 py-3"><span className="text-sm font-bold text-white">{s.pts.toLocaleString()}</span></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1"><span className="text-amber-400">🔥</span><span className="text-sm text-amber-400 font-bold">{s.streak}d</span></div></td>
                  <td className="px-5 py-3"><span className={`text-sm font-bold ${s.avgScore >= 80 ? "text-emerald-400" : s.avgScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{s.avgScore}%</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "badges" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Medallas del Sistema</h2>
            <div className="grid grid-cols-3 gap-4">
              {BADGES_DATA.map(b => (
                <div key={b.id} className="bg-[#141626] border border-white/10 rounded-2xl p-4 hover:border-amber-500/20 transition-colors">
                  <div className="flex items-start gap-3"><span className="text-4xl">{b.icon}</span>
                    <div><h3 className="text-sm font-bold text-white">{b.name}</h3><p className="text-xs text-slate-400 mt-0.5">{b.desc}</p></div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-slate-500">{b.criteria}</span>
                    <span className="text-xs font-bold text-amber-400">{b.earned} ganaron</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Catálogo de Recompensas</h2>
              <button onClick={() => setShowAddReward(true)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Agregar Recompensa</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {rewards.map(r => (
                <div key={r.id} className={`bg-[#141626] border rounded-2xl p-4 ${r.active ? "border-white/10" : "border-white/5 opacity-50"}`}>
                  <span className="text-3xl block mb-2">{r.icon}</span>
                  <h3 className="text-sm font-bold text-white">{r.name}</h3>
                  <p className="text-lg font-extrabold text-amber-400 mt-1">{r.cost} <span className="text-xs font-medium text-slate-400">monedas</span></p>
                  <div className="flex justify-between text-xs text-slate-500 mt-2"><span>Stock: {r.stock}</span><span>Canjeados: {r.redeemed}</span></div>
                  <button onClick={() => toggleReward(r.id)} className={`w-full mt-2 text-xs text-center py-1 rounded-lg transition-colors ${r.active ? "bg-emerald-500/15 text-emerald-400 hover:bg-red-500/15 hover:text-red-400" : "bg-white/5 text-slate-400 hover:bg-emerald-500/15 hover:text-emerald-400"}`}>
                    {r.active ? "Activo — clic para desactivar" : "Inactivo — clic para activar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────

function ReportsView() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week");
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Reportes y Analítica</h1><p className="text-sm text-slate-500 mt-0.5">Métricas de rendimiento operativo</p></div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {(["week","month","quarter"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:text-white"}`}>
                {p === "week" ? "Semana" : p === "month" ? "Mes" : "Trimestre"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-sm px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"><Download className="w-4 h-4" />Exportar</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Retos completados", value: "847", sub: "esta semana", color: "text-indigo-400" },
          { label: "Score promedio", value: "81%", sub: "+3% vs anterior", color: "text-emerald-400" },
          { label: "Empleados activos", value: "143", sub: "de 150", color: "text-amber-400" },
          { label: "Tiempo prom./reto", value: "1m 48s", sub: "dentro del límite", color: "text-violet-400" },
        ].map(k => (
          <div key={k.label} className="bg-[#141626] border border-white/10 rounded-2xl p-4">
            <p className={`text-3xl font-extrabold ${k.color}`}>{k.value}</p>
            <p className="text-sm text-slate-300 mt-1">{k.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-[#141626] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Completación Diaria vs Meta</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={COMPLETION_DATA}>
              <defs>
                <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} name="Meta" />
              <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={2} fill="url(#rg1)" dot={{ fill: "#4F46E5", r: 3 }} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {PIE_DATA.map((e, i) => <Cell key={`pc-${i}`} fill={e.color} />)}
            </Pie><Tooltip contentStyle={{ background: "#1e2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: d.color }} /><span className="text-xs text-slate-400 flex-1">{d.name}</span><span className="text-xs font-bold text-slate-300">{d.value}%</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Protocols ────────────────────────────────────────────────────────────────

const PROTO_TAGS = ["Emergencias","Bioseguridad","Inventario","Diagnóstico","Preventiva","Quirúrgico","Farmacia","Bienestar","Técnico","Clínico","Servicio","Nutrición","Operaciones","Auditoría","Caja","Control"];
const PROTO_EMOJIS = ["🚨","❤️","💉","🌡️","😴","🔬","💊","🐈","✂️","🛁","🦠","🔍","🐾","💅","🥩","🐠","🏷️","🔄","🌟","📦","📋","🧮","🔑","💰","📊","🛡️","⚙️","📁"];

const INIT_PROTOCOLS: ProtoItem[] = [
  ...PROTOCOLS_MEDICA.map((p, i) => ({ ...p, id: i + 1, area: "medica" as const })),
  ...PROTOCOLS_PELQUERIA.map((p, i) => ({ ...p, id: 100 + i + 1, area: "peluqueria" as const })),
  ...PROTOCOLS_PETSHOP.map((p, i) => ({ ...p, id: 200 + i + 1, area: "petshop" as const })),
  { id: 301, area: "operaciones" as const, emoji: "📦", title: "Protocolo de Re-inventario", sub: "Conteo físico vs sistema", tag: "Control", updated: "14 Jul",
    desc: "Frecuencia mínima: mensual para insumos críticos, trimestral para stock general.\n\n📋 PASOS:\n1. Bloquear movimientos en el sistema 30 min antes del conteo.\n2. Designar 2 personas para conteo independiente (doble verificación).\n3. Comparar físico vs sistema. Diferencia > 2% activa alerta.\n4. Documentar hallazgos con causa probable (merma, robo, error de ingreso).\n5. Ajustar sistema y notificar a jefatura.\n\n⚠️ NUNCA ajustar sin aprobación del jefe de turno o gerencia." },
  { id: 302, area: "operaciones" as const, emoji: "📊", title: "Auditoría de Almacén", sub: "Inspección periódica de stock", tag: "Auditoría", updated: "12 Jul",
    desc: "Auditoría interna mensual y auditoría externa trimestral.\n\n✅ CHECKLIST DE AUDITORÍA:\n□ Verificar fechas de vencimiento — retiro de productos vencidos.\n□ Revisar condiciones de almacenamiento (temperatura, humedad, luz).\n□ Comprobar que cada producto tiene etiqueta y lote visible.\n□ Confirmar que los registros de movimiento están al día.\n□ Revisar que el área esté ordenada (método PEPS: primero entra, primero sale).\n□ Chequear estado físico del mobiliario y refrigeración.\n\n📁 Resultado de auditoría: llenar formato F-AUDIT-001 y archivar." },
  { id: 303, area: "operaciones" as const, emoji: "💰", title: "Cuadre de Caja", sub: "Apertura, cierre y descuadres", tag: "Caja", updated: "10 Jul",
    desc: "🔓 APERTURA DE CAJA:\n1. Recibir fondo de caja con ticket firmado por el cajero saliente.\n2. Contar físicamente billetes y monedas — registrar en sistema.\n3. Verificar que el monto coincide con el fondo establecido.\n4. Anotar hora de apertura y firmar con jefe de turno.\n\n🔒 CIERRE DE CAJA:\n1. Realizar corte Z en la caja registradora.\n2. Contar efectivo físico por denominación.\n3. Comparar total físico vs total sistema.\n4. Diferencia ≤ S/2.00: registrar como tolerancia normal.\n5. Diferencia > S/2.00: abrir informe de descuadre (F-CAJA-002).\n\n⚠️ Todo descuadre debe reportarse sin excepción, nunca ajustar sin autorización." },
  { id: 304, area: "operaciones" as const, emoji: "📉", title: "Control de Mermas", sub: "Registro y reducción de pérdidas", tag: "Control", updated: "08 Jul",
    desc: "Las mermas incluyen: vencimiento, daño, robo, error de despacho.\n\n📋 REGISTRO OBLIGATORIO:\n□ Fecha y hora del hallazgo.\n□ Descripción del producto: nombre, lote, cantidad.\n□ Causa de la merma (de la lista estandarizada).\n□ Firma de quien reporta + jefe de piso.\n\n📊 META: Merma < 0.5% del valor de inventario mensual.\n\n🚨 ALERTA si supera el 1%: auditoría inmediata y revisión de protocolos de almacenamiento." },
  { id: 305, area: "operaciones" as const, emoji: "🚚", title: "Recepción de Mercancía", sub: "Verificación, ingreso y trazabilidad", tag: "Inventario", updated: "06 Jul",
    desc: "1. Verificar que el proveedor coincide con la orden de compra vigente.\n2. Revisar condición del embalaje — rechazar si hay daño físico o manipulación.\n3. Contar unidades físicas vs factura (ítem por ítem).\n4. Para cadena de frío: verificar temperatura de transporte con termómetro.\n5. Ingresar al sistema con número de lote y fecha de vencimiento.\n6. Ubicar según método PEPS: nueva mercancía al fondo.\n7. Firmar factura de conformidad. Guardar copia física y digital.\n\n⛔ RECHAZAR si: temperatura fuera de rango, embalaje roto, fecha de vencimiento < 3 meses." },
  { id: 306, area: "operaciones" as const, emoji: "🔑", title: "Cierre de Turno Administrativo", sub: "Checklist de entrega de turno", tag: "Operaciones", updated: "04 Jul",
    desc: "⏰ 30 minutos antes del cierre:\n□ Completar todos los registros pendientes del turno.\n□ Comunicar al ingreso los casos en seguimiento (internados, pendientes de llamada).\n□ Verificar que la caja esté cuadrada y el informe listo.\n\n📋 AL CIERRE:\n□ Re-inventario rápido de medicamentos controlados (doble firma).\n□ Cierre de caja y entrega a jefe de turno entrante.\n□ Completar formato F-TURNO-001 con novedades del turno.\n□ Briefing de 5 minutos con turno entrante.\n\n✅ El turno no termina hasta que el turno entrante recibe y firma el formato." },
];

function ProtocolsView() {
  type ProtocolArea = "medica" | "peluqueria" | "petshop" | "operaciones";
  const [protocols, setProtocols] = useState<ProtoItem[]>(INIT_PROTOCOLS);
  const [tab, setTab] = useState<ProtocolArea>("medica");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<ProtoItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const emptyForm = { emoji: "📋", title: "", sub: "", desc: "", tag: "Operaciones", area: tab as ProtocolArea };
  const [form, setForm] = useState(emptyForm);

  const filtered = protocols.filter(p => p.area === tab && (
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  ));

  function openNew() {
    setEditingId(null);
    setForm({ ...emptyForm, area: tab });
    setShowForm(true);
  }
  function openEdit(p: ProtoItem) {
    setEditingId(p.id);
    setForm({ emoji: p.emoji, title: p.title, sub: p.sub, desc: p.desc, tag: p.tag, area: p.area });
    setShowForm(true);
    setDetail(null);
  }
  function saveForm() {
    if (!form.title.trim()) return;
    const today = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    if (editingId !== null) {
      setProtocols(prev => prev.map(p => p.id === editingId ? { ...p, ...form, updated: today } : p));
    } else {
      setProtocols(prev => [...prev, { ...form, id: Date.now(), updated: today }]);
    }
    setShowForm(false);
    setEditingId(null);
  }
  function deleteProto(id: number) {
    setProtocols(prev => prev.filter(p => p.id !== id));
    setDetail(null);
  }

  const tabDefs: { id: ProtocolArea; label: string }[] = [
    { id: "medica", label: "🏥 Médica" },
    { id: "peluqueria", label: "✂️ Peluquería" },
    { id: "petshop", label: "🛒 PetShop" },
    { id: "operaciones", label: "⚙️ Operaciones" },
  ];

  const FormModal = () => (
    <Modal title={editingId ? "Editar Protocolo" : "Nuevo Protocolo"} onClose={() => setShowForm(false)} wide>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Ícono</label>
            <div className="flex flex-wrap gap-1.5">
              {PROTO_EMOJIS.map(e => (
                <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))}
                  className={`w-9 h-9 rounded-xl text-lg transition-all ${form.emoji === e ? "bg-indigo-500 ring-2 ring-indigo-400" : "bg-white/5 hover:bg-white/15"}`}>{e}</button>
              ))}
            </div>
          </div>
          <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Título *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="ej. Protocolo de Urgencias"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
          </div>
          <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Subtítulo</label>
            <input value={form.sub} onChange={e => setForm(p => ({ ...p, sub: e.target.value }))} placeholder="ej. Paso a paso completo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Área</label>
              <select value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value as ProtocolArea }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                {tabDefs.map(t => <option key={t.id} value={t.id} className="bg-[#141626]">{t.label}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Etiqueta</label>
              <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                {PROTO_TAGS.map(t => <option key={t} value={t} className="bg-[#141626]">{t}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex-1"><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Contenido del Protocolo</label>
            <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={16}
              placeholder={"Escribe el protocolo paso a paso...\n\n✅ Usa emojis para resaltar secciones\n□ Usa □ para checklists\n1. Para pasos numerados"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none resize-none font-mono leading-relaxed" />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
        <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors">Cancelar</button>
        <button onClick={saveForm} disabled={!form.title.trim()} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {editingId ? "Guardar cambios" : "Crear Protocolo"}
        </button>
      </div>
    </Modal>
  );

  return (
    <div className="p-6 space-y-5">
      {showForm && <FormModal />}
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)} wide>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-4xl">{detail.emoji}</span>
                <div>
                  <p className="text-indigo-400 text-sm font-semibold">{detail.sub}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{detail.tag}</span>
                    <span className="text-xs text-slate-600">Actualizado {detail.updated}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(detail)} className="flex items-center gap-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 px-3 py-1.5 rounded-lg text-xs transition-colors"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
                <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"><Download className="w-3.5 h-3.5" /> PDF</button>
              </div>
            </div>
            <div className="bg-white/3 border border-white/8 rounded-xl p-5">
              {detail.desc.split("\n").map((line, i) => {
                const isCheck = line.trim().startsWith("□") || line.trim().startsWith("✅") || line.trim().startsWith("✓");
                const isHeader = line.trim().startsWith("📋") || line.trim().startsWith("🔓") || line.trim().startsWith("🔒") || line.trim().startsWith("⚠️") || line.trim().startsWith("⛔");
                return line.trim() === ""
                  ? <div key={i} className="h-3" />
                  : <p key={i} className={`text-sm leading-relaxed ${isCheck ? "text-emerald-300 pl-2" : isHeader ? "text-amber-300 font-semibold mt-1" : "text-slate-300"}`}>{line}</p>;
              })}
            </div>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca de Protocolos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{protocols.length} protocolos · {filtered.length} en esta área</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Protocolo
        </button>
      </div>
      <div className="flex gap-2">
        {tabDefs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 px-4 rounded-2xl border text-sm font-semibold transition-all ${tab === t.id ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-white/3 border-white/10 text-slate-400 hover:border-white/20"}`}>
            {t.label} <span className="ml-1 text-xs opacity-60">({protocols.filter(p => p.area === t.id).length})</span>
          </button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar protocolos..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-[#141626] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">{p.title}</h3>
                <p className="text-xs text-indigo-400 mt-0.5 font-medium">{p.sub}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3 flex-1">{p.desc}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{p.tag}</span>
              <span className="text-xs text-slate-600 ml-auto">Actualizado {p.updated}</span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button onClick={() => setDetail(p)} className="flex-1 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" /> Ver completo
              </button>
              <button onClick={() => openEdit(p)} className="flex-1 text-xs bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Edit2 className="w-3 h-3" /> Editar
              </button>
              <button onClick={() => deleteProto(p.id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-14 text-slate-600">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">No hay protocolos en esta área todavía.</p>
            <button onClick={openNew} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">+ Crear el primero</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Learning Paths ───────────────────────────────────────────────────────────

function LearningPathsView({ paths, setPaths, certs, setCerts }: {
  paths: LearningPath[]; setPaths: (p: LearningPath[]) => void;
  certs: Certificate[]; setCerts: (c: Certificate[]) => void;
}) {
  const [mode, setMode] = useState<"list" | "builder" | "exam">("list");
  const [selPath, setSelPath] = useState<LearningPath | null>(null);
  const [examPath, setExamPath] = useState<LearningPath | null>(null);
  const [examStaff, setExamStaff] = useState<StaffMember | null>(null);
  const [selectStaffModal, setSelectStaffModal] = useState<LearningPath | null>(null);

  // Builder state
  const [bStep, setBStep] = useState(0);
  const [bInfo, setBInfo] = useState({ title: "", role: ROLES[0], description: "", color: "#4F46E5", icon: "🎓", duration: "30 días", tutorId: null as number | null });
  const [bStages, setBStages] = useState<PathStage[]>([
    { id: 1, period: "Día 1", title: "Inducción", modules: ["Bienvenida", "Normas básicas"] },
  ]);
  const [bStaff, setBStaff] = useState<number[]>([]);
  const [bExam, setBExam] = useState({ hasFinalExam: true, passingScore: 80, certTitle: "", certSubtitle: "", certIssuer: "VetLearn Operations" });
  const [bExamQs, setBExamQs] = useState<ExamQuestion[]>([
    { id: 1, text: "", type: "multiple", options: ["","","",""], correct: 0, explanation: "" },
  ]);

  const ICONS = ["🎓","🩺","✂️","🛒","🏥","💊","🐕","🐈","🦜","🧪","🏆","📋"];
  const COLORS = ["#4F46E5","#10b981","#ec4899","#22c55e","#f59e0b","#8b5cf6","#ef4444","#06b6d4"];

  function addStage() { setBStages(p => [...p, { id: Date.now(), period: "", title: "", modules: [""] }]); }
  function updStage(id: number, field: keyof PathStage, val: string) { setBStages(p => p.map(s => s.id === id ? { ...s, [field]: val } : s)); }
  function addModule(sid: number) { setBStages(p => p.map(s => s.id === sid ? { ...s, modules: [...s.modules, ""] } : s)); }
  function updModule(sid: number, idx: number, val: string) { setBStages(p => p.map(s => s.id === sid ? { ...s, modules: s.modules.map((m, i) => i === idx ? val : m) } : s)); }
  function removeModule(sid: number, idx: number) { setBStages(p => p.map(s => s.id === sid ? { ...s, modules: s.modules.filter((_, i) => i !== idx) } : s)); }
  function removeStage(id: number) { if (bStages.length > 1) setBStages(p => p.filter(s => s.id !== id)); }
  function toggleStaff(id: number) { setBStaff(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

  // Exam question builder helpers
  function addExamQ() {
    setBExamQs(p => [...p, { id: Date.now(), text: "", type: "multiple", options: ["","","",""], correct: 0, explanation: "" }]);
  }
  function updExamQ(id: number, field: keyof ExamQuestion, val: unknown) {
    setBExamQs(p => p.map(q => q.id === id ? { ...q, [field]: val } : q));
  }
  function updExamOpt(qId: number, idx: number, val: string) {
    setBExamQs(p => p.map(q => q.id === qId ? { ...q, options: q.options.map((o, i) => i === idx ? val : o) } : q));
  }
  function removeExamQ(id: number) { if (bExamQs.length > 1) setBExamQs(p => p.filter(q => q.id !== id)); }
  function setExamType(id: number, type: "multiple" | "truefalse") {
    setBExamQs(p => p.map(q => q.id === id ? { ...q, type, options: type === "truefalse" ? ["Verdadero","Falso"] : ["","","",""], correct: 0 } : q));
  }

  function resetBuilder() {
    setBStep(0);
    setBInfo({ title: "", role: ROLES[0], description: "", color: "#4F46E5", icon: "🎓", duration: "30 días", tutorId: null });
    setBStages([{ id: 1, period: "Día 1", title: "Inducción", modules: ["Bienvenida"] }]);
    setBStaff([]);
    setBExam({ hasFinalExam: true, passingScore: 80, certTitle: "", certSubtitle: "", certIssuer: "VetLearn Operations" });
    setBExamQs([{ id: 1, text: "", type: "multiple", options: ["","","",""], correct: 0, explanation: "" }]);
  }

  function savePath() {
    const newPath: LearningPath = {
      id: Date.now(), title: bInfo.title || "Nueva Ruta", role: bInfo.role,
      description: bInfo.description, color: bInfo.color, icon: bInfo.icon, duration: bInfo.duration,
      stages: bStages, assignedStaff: bStaff, tutorId: bInfo.tutorId,
      hasFinalExam: bExam.hasFinalExam, passingScore: bExam.passingScore,
      examQuestions: bExam.hasFinalExam ? bExamQs.filter(q => q.text.trim()) : [],
      certTitle: bExam.certTitle || `Certificado: ${bInfo.title}`,
      certSubtitle: bExam.certSubtitle, certIssuer: bExam.certIssuer,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPaths([newPath, ...paths]);
    setMode("list");
    resetBuilder();
  }

  // ── Exam runner ───────────────────────────────────────────────────────────
  const [eQ, setEQ] = useState(0);
  const [eSel, setESel] = useState<number | null>(null);
  const [eAnswered, setEAnswered] = useState(false);
  const [eScore, setEScore] = useState(0);
  const [eDone, setEDone] = useState(false);

  function startExam(path: LearningPath, staff: StaffMember) {
    setExamPath(path); setExamStaff(staff);
    setEQ(0); setESel(null); setEAnswered(false); setEScore(0); setEDone(false);
    setSelectStaffModal(null);
    setMode("exam");
  }
  function handleExamAnswer(idx: number) {
    if (eAnswered || !examPath) return;
    setESel(idx); setEAnswered(true);
    const qs = examPath.examQuestions;
    if (idx === qs[eQ].correct) setEScore(s => s + 1);
  }
  function nextExamQ() {
    if (!examPath) return;
    if (eQ < examPath.examQuestions.length - 1) { setEQ(q => q + 1); setESel(null); setEAnswered(false); }
    else setEDone(true);
  }
  function finishExam() {
    if (!examPath || !examStaff) return;
    const total = examPath.examQuestions.length;
    const pct = total > 0 ? Math.round(eScore / total * 100) : 0;
    const passed = pct >= examPath.passingScore;
    if (passed) {
      setCerts([{
        id: Date.now(), recipientName: examStaff.name, recipientRole: examStaff.role,
        pathTitle: examPath.title, score: pct,
        date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        issuer: examPath.certIssuer, certSubtitle: examPath.certSubtitle,
      }, ...certs]);
    }
    setMode("list"); setEDone(false); setExamPath(null); setExamStaff(null);
  }

  // ── Exam mode ─────────────────────────────────────────────────────────────
  if (mode === "exam" && examPath && examStaff) {
    const qs = examPath.examQuestions;
    if (qs.length === 0) {
      return (
        <div className="p-6 flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <p className="text-5xl">📋</p>
            <p className="text-white font-bold">Esta ruta no tiene preguntas configuradas</p>
            <p className="text-slate-400 text-sm">Edita la ruta y agrega preguntas en el paso "Examen Final".</p>
            <button onClick={() => setMode("list")} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl text-sm transition-colors">← Volver</button>
          </div>
        </div>
      );
    }
    const q = qs[eQ];
    const total = qs.length;
    const pct = Math.round(eScore / total * 100);
    const passed = pct >= examPath.passingScore;
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setMode("list")} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <p className="text-xs text-slate-500">{examPath.title} — Examen Final</p>
            {!eDone && <div className="flex gap-1.5 mt-1">{qs.map((_, i) => <div key={i} className={`flex-1 h-1.5 rounded-full ${i < eQ ? "bg-indigo-500" : i === eQ ? "bg-indigo-400" : "bg-white/15"}`} />)}</div>}
          </div>
          {!eDone && <span className="text-xs text-slate-500 font-mono">{eQ + 1} / {total}</span>}
        </div>
        {!eDone ? (
          <>
            <div className="flex items-center gap-3 mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
              <Av initials={examStaff.initials} from={examStaff.gradientFrom} to={examStaff.gradientTo} size="sm" />
              <div className="flex-1"><p className="text-sm font-semibold text-white">{examStaff.name}</p><p className="text-xs text-slate-400">{examStaff.role}</p></div>
              {examPath.tutorId && (() => { const tutor = STAFF_DATA.find(s => s.id === examPath.tutorId); return tutor ? <div className="flex items-center gap-1.5 text-xs text-slate-400"><span>Tutor:</span><span className="font-semibold text-slate-300">{tutor.name.split(" ")[0]}</span></div> : null; })()}
            </div>
            <div className="bg-[#141626] border border-white/10 rounded-2xl p-5 mb-4">
              <p className="text-white font-semibold text-base leading-relaxed">{q.text}</p>
            </div>
            <div className="space-y-2.5 mb-4">
              {q.options.map((opt, i) => {
                let cls = "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10";
                if (eAnswered) cls = i === q.correct ? "bg-emerald-500/20 border-emerald-500 text-emerald-200" : i === eSel ? "bg-red-500/20 border-red-500 text-red-300" : "bg-white/3 border-white/8 text-slate-600";
                return (
                  <button key={i} onClick={() => handleExamAnswer(i)} disabled={eAnswered}
                    className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all ${cls}`}>
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${eAnswered && i === q.correct ? "bg-emerald-500 text-white" : eAnswered && i === eSel && i !== q.correct ? "bg-red-500 text-white" : "bg-white/10 text-slate-400"}`}>
                      {eAnswered && i === q.correct ? "✓" : eAnswered && i === eSel && i !== q.correct ? "✗" : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {eAnswered && (
              <div className={`rounded-2xl border p-4 ${eSel === q.correct ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red-500/15 border-red-500/30"}`}>
                <p className={`font-bold text-sm mb-1 ${eSel === q.correct ? "text-emerald-400" : "text-red-400"}`}>{eSel === q.correct ? "✅ Correcto" : "❌ Incorrecto"}</p>
                <p className="text-slate-300 text-xs leading-relaxed">{q.explanation}</p>
                <button onClick={nextExamQ} className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
                  {eQ < total - 1 ? "Siguiente →" : "Ver resultados →"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-5 py-6">
            <p className="text-7xl">{passed ? "🏆" : "📚"}</p>
            <div>
              <h2 className="text-2xl font-bold text-white">{passed ? "¡Aprobado!" : "No aprobado"}</h2>
              <p className="text-slate-400 mt-1">{examStaff.name} — {examPath.title}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 text-center"><p className="text-3xl font-extrabold text-white">{eScore}/{total}</p><p className="text-sm text-slate-400 mt-1">Correctas</p></div>
              <div className={`border rounded-2xl px-8 py-4 text-center ${passed ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red-500/10 border-red-500/20"}`}>
                <p className={`text-3xl font-extrabold ${passed ? "text-emerald-400" : "text-red-400"}`}>{pct}%</p>
                <p className="text-sm text-slate-400 mt-1">Score (mín. {examPath.passingScore}%)</p>
              </div>
            </div>
            {passed && <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"><p className="text-amber-400 font-semibold text-sm">🏅 Se generará un certificado automáticamente</p><p className="text-xs text-slate-400 mt-1">Disponible en la sección Certificaciones</p></div>}
            <button onClick={finishExam} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl transition-colors">{passed ? "Finalizar y generar certificado" : "Finalizar"}</button>
          </div>
        )}
      </div>
    );
  }

  // ── Builder mode ──────────────────────────────────────────────────────────
  if (mode === "builder") {
    const bSteps = ["Información", "Etapas", "Colaboradores", "Examen Final"];
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setMode("list")} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-white flex-1">Crear Ruta de Aprendizaje</h1>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {bSteps.map((s, i) => (
              <button key={s} onClick={() => i <= bStep ? setBStep(i) : null}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${bStep === i ? "bg-[#4F46E5] text-white" : i < bStep ? "text-emerald-400" : "text-slate-500"}`}>
                {i < bStep ? "✓" : i + 1}. {s}
              </button>
            ))}
          </div>
        </div>

        {bStep === 0 && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Ícono</label>
                <div className="flex flex-wrap gap-2">{ICONS.map(e => <button key={e} onClick={() => setBInfo(p => ({ ...p, icon: e }))} className={`w-10 h-10 rounded-xl text-xl transition-all ${bInfo.icon === e ? "ring-2 ring-indigo-400 bg-indigo-500/30" : "bg-white/5 hover:bg-white/10"}`}>{e}</button>)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Color de la Ruta</label>
                <div className="flex gap-2">{COLORS.map(c => <button key={c} onClick={() => setBInfo(p => ({ ...p, color: c }))} className={`w-8 h-8 rounded-xl transition-all ${bInfo.color === c ? "ring-2 ring-white/50 scale-110" : ""}`} style={{ background: c }} />)}</div>
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Título *</label>
                <input value={bInfo.title} onChange={e => setBInfo(p => ({ ...p, title: e.target.value }))} placeholder="ej. Inducción Médico Veterinario"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Descripción</label>
                <textarea value={bInfo.description} onChange={e => setBInfo(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Describe el objetivo de esta ruta..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Rol objetivo</label>
                  <select value={bInfo.role} onChange={e => setBInfo(p => ({ ...p, role: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                    {ROLES.map(r => <option key={r} value={r} className="bg-[#141626]">{r}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Duración estimada</label>
                  <select value={bInfo.duration} onChange={e => setBInfo(p => ({ ...p, duration: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                    {["7 días","14 días","30 días","60 días","90 días","6 meses"].map(d => <option key={d} value={d} className="bg-[#141626]">{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Tutor Responsable</label>
                <p className="text-xs text-slate-500 mb-2">Persona que guiará y acompañará al colaborador durante la ruta.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setBInfo(p => ({ ...p, tutorId: null }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-sm ${bInfo.tutorId === null ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-white/3 text-slate-500 hover:border-white/20"}`}>
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 flex-shrink-0"><User className="w-3.5 h-3.5" /></div>
                    Sin tutor asignado
                  </button>
                  {STAFF_DATA.filter(s => ["Médico Veterinario","Jefe de Piso"].includes(s.role) || s.area === "Operaciones").map(s => (
                    <button key={s.id} onClick={() => setBInfo(p => ({ ...p, tutorId: s.id }))}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${bInfo.tutorId === s.id ? "border-indigo-500/50 bg-indigo-500/10" : "border-white/10 bg-white/3 hover:border-white/20"}`}>
                      <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                      <div className="min-w-0"><p className="text-xs font-semibold text-white truncate">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div>
                      {bInfo.tutorId === s.id && <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">Vista Previa</label>
              <div className="rounded-2xl border p-5" style={{ borderColor: `${bInfo.color}40`, background: `${bInfo.color}12` }}>
                <span className="text-4xl">{bInfo.icon}</span>
                <h3 className="text-lg font-bold text-white mt-3">{bInfo.title || "Título de la ruta"}</h3>
                <p className="text-sm text-slate-400 mt-1">{bInfo.description || "Descripción..."}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${bInfo.color}25`, color: bInfo.color }}>{bInfo.role}</span>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{bInfo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {bStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Define las etapas de la ruta. Cada etapa tiene un período y módulos de aprendizaje.</p>
            {bStages.map((stage, si) => (
              <div key={stage.id} className="bg-[#141626] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-indigo-400">Etapa {si + 1}</span>
                  {bStages.length > 1 && <button onClick={() => removeStage(stage.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="text-xs text-slate-500 block mb-1">Período</label>
                    <input value={stage.period} onChange={e => updStage(stage.id, "period", e.target.value)} placeholder="ej. Día 1, Semana 1, Mes 3"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 outline-none" />
                  </div>
                  <div><label className="text-xs text-slate-500 block mb-1">Título de la etapa</label>
                    <input value={stage.title} onChange={e => updStage(stage.id, "title", e.target.value)} placeholder="ej. Inducción Clínica"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 outline-none" />
                  </div>
                </div>
                <label className="text-xs text-slate-500 block mb-2">Módulos</label>
                <div className="space-y-2">
                  {stage.modules.map((mod, mi) => (
                    <div key={mi} className="flex gap-2">
                      <input value={mod} onChange={e => updModule(stage.id, mi, e.target.value)} placeholder={`Módulo ${mi + 1}`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 outline-none" />
                      {stage.modules.length > 1 && <button onClick={() => removeModule(stage.id, mi)} className="p-2 rounded-xl hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>}
                    </div>
                  ))}
                  <button onClick={() => addModule(stage.id)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"><Plus className="w-3.5 h-3.5" />Agregar módulo</button>
                </div>
              </div>
            ))}
            <button onClick={addStage} className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 text-sm font-medium transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Agregar Etapa
            </button>
          </div>
        )}

        {bStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Selecciona los colaboradores que estarán en esta ruta de aprendizaje.</p>
            <div className="grid grid-cols-2 gap-3">
              {STAFF_DATA.filter(s => s.role === bInfo.role || bInfo.role === "").map(s => (
                <button key={s.id} onClick={() => toggleStaff(s.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${bStaff.includes(s.id) ? "border-indigo-500/50 bg-indigo-500/10" : "border-white/10 bg-white/3 hover:border-white/20"}`}>
                  <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{s.name}</p><p className="text-xs text-slate-500">{s.role} · {s.area}</p></div>
                  {bStaff.includes(s.id) && <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
                </button>
              ))}
              {STAFF_DATA.filter(s => s.role === bInfo.role).length === 0 && (
                <div className="col-span-2 text-center py-6 text-slate-500 text-sm">
                  No hay colaboradores con el rol "{bInfo.role}".<br />
                  <button onClick={() => setBStaff(STAFF_DATA.map(s => s.id))} className="text-indigo-400 hover:text-indigo-300 mt-2 text-xs transition-colors">Asignar todos los colaboradores</button>
                </div>
              )}
            </div>
            {bStaff.length > 0 && <p className="text-xs text-indigo-400 font-semibold">{bStaff.length} colaboradores seleccionados</p>}
          </div>
        )}

        {bStep === 3 && (
          <div className="space-y-5">
            {/* Config row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/3 border border-white/8 rounded-xl p-4 col-span-1">
                <Toggle value={bExam.hasFinalExam} onChange={v => setBExam(p => ({ ...p, hasFinalExam: v }))} label="Incluir examen final" desc="Al completar la ruta se aplica un examen" />
              </div>
              {bExam.hasFinalExam && (
                <>
                  <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">% mínimo para aprobar</p>
                    <div className="flex gap-1.5">{[60,70,75,80,90].map(v => (
                      <button key={v} onClick={() => setBExam(p => ({ ...p, passingScore: v }))}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${bExam.passingScore === v ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-400"}`}>{v}%</button>
                    ))}</div>
                  </div>
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-400 mb-1">🏅 Certificado al aprobar</p>
                    <input value={bExam.certTitle} onChange={e => setBExam(p => ({ ...p, certTitle: e.target.value }))} placeholder={`Certificado: ${bInfo.title || "..."}`}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-amber-500/50 outline-none" />
                    <input value={bExam.certSubtitle} onChange={e => setBExam(p => ({ ...p, certSubtitle: e.target.value }))} placeholder={`${bInfo.role} — VetCenter`}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-amber-500/50 outline-none" />
                    <input value={bExam.certIssuer} onChange={e => setBExam(p => ({ ...p, certIssuer: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500/50 outline-none" />
                  </div>
                </>
              )}
            </div>

            {/* Question builder */}
            {bExam.hasFinalExam && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-white">Preguntas del Examen</p>
                    <p className="text-xs text-slate-500 mt-0.5">{bExamQs.filter(q => q.text.trim()).length} pregunta(s) configurada(s)</p>
                  </div>
                  <button onClick={addExamQ} className="flex items-center gap-1.5 text-xs bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Agregar pregunta
                  </button>
                </div>
                <div className="space-y-3">
                  {bExamQs.map((q, qi) => (
                    <div key={q.id} className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden">
                      {/* Question header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">{qi + 1}</span>
                          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 gap-0.5">
                            {(["multiple","truefalse"] as const).map(t => (
                              <button key={t} onClick={() => setExamType(q.id, t)}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${q.type === t ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
                                {t === "multiple" ? "Opción Múltiple" : "Verdadero / Falso"}
                              </button>
                            ))}
                          </div>
                        </div>
                        {bExamQs.length > 1 && (
                          <button onClick={() => removeExamQ(q.id)} className="p-1 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {/* Question body */}
                      <div className="p-4 space-y-3">
                        <textarea value={q.text} onChange={e => updExamQ(q.id, "text", e.target.value)} rows={2}
                          placeholder="Escribe la pregunta aquí..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none resize-none" />
                        {/* Options */}
                        <div className="space-y-2">
                          {(q.type === "truefalse" ? ["Verdadero","Falso"] : q.options).map((opt, i) => (
                            <div key={i} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all ${q.correct === i ? "border-emerald-500/40 bg-emerald-500/8" : "border-white/8 bg-white/3"}`}>
                              <button onClick={() => updExamQ(q.id, "correct", i)}
                                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correct === i ? "border-emerald-500 bg-emerald-500" : "border-slate-600 hover:border-emerald-500"}`}>
                                {q.correct === i && <span className="text-white text-xs leading-none">✓</span>}
                              </button>
                              {q.type === "truefalse"
                                ? <span className={`text-sm flex-1 ${q.correct === i ? "text-emerald-300 font-semibold" : "text-slate-400"}`}>{opt}</span>
                                : <input value={opt} onChange={e => updExamOpt(q.id, i, e.target.value)}
                                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                                    className={`flex-1 bg-transparent text-sm outline-none ${q.correct === i ? "text-emerald-300 font-semibold" : "text-white"} placeholder-slate-700`} />
                              }
                              {q.correct === i && <span className="text-xs text-emerald-400 font-bold flex-shrink-0">✓ Correcta</span>}
                            </div>
                          ))}
                        </div>
                        {/* Explanation */}
                        <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/15 rounded-xl px-3 py-2">
                          <span className="text-amber-400 text-sm mt-0.5 flex-shrink-0">💡</span>
                          <input value={q.explanation} onChange={e => updExamQ(q.id, "explanation", e.target.value)}
                            placeholder="Explicación de la respuesta correcta (visible al finalizar el examen)"
                            className="flex-1 bg-transparent text-xs text-amber-200 placeholder-amber-900 outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addExamQ} className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-white/10 text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Agregar otra pregunta
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="bg-[#141626] border border-white/10 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumen final</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  ["Etapas", bStages.length, "text-indigo-400"],
                  ["Módulos", bStages.reduce((a, s) => a + s.modules.filter(m => m.trim()).length, 0), "text-violet-400"],
                  ["Colaboradores", bStaff.length, "text-emerald-400"],
                  ["Preguntas examen", bExam.hasFinalExam ? bExamQs.filter(q => q.text.trim()).length : "—", "text-amber-400"],
                ].map(([k, v, c]) => (
                  <div key={String(k)} className="bg-white/5 rounded-xl p-3 text-center">
                    <p className={`text-2xl font-extrabold ${c}`}>{v}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-5 border-t border-white/8">
          <button onClick={() => bStep > 0 ? setBStep(s => s - 1) : setMode("list")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" /> {bStep === 0 ? "Cancelar" : "Anterior"}
          </button>
          {bStep < 3
            ? <button onClick={() => setBStep(s => s + 1)} disabled={bStep === 0 && !bInfo.title.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold disabled:opacity-30 hover:bg-indigo-500 transition-colors">Siguiente <ChevronRight className="w-4 h-4" /></button>
            : <button onClick={savePath} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors"><CheckCircle className="w-4 h-4" /> Crear Ruta</button>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Staff selector modal for exam */}
      {selectStaffModal && (
        <Modal title={`Seleccionar colaborador — ${selectStaffModal.title}`} onClose={() => setSelectStaffModal(null)}>
          <p className="text-sm text-slate-400 mb-4">Elige quién tomará el examen final de esta ruta.</p>
          <div className="space-y-2">
            {STAFF_DATA.filter(s => selectStaffModal.assignedStaff.includes(s.id)).map(s => (
              <button key={s.id} onClick={() => startExam(selectStaffModal, s)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/3 hover:border-indigo-500/40 hover:bg-indigo-500/8 text-left transition-all">
                <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                <div className="flex-1"><p className="text-sm font-semibold text-white">{s.name}</p><p className="text-xs text-slate-400">{s.role} · {s.area}</p></div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
            {STAFF_DATA.filter(s => selectStaffModal.assignedStaff.includes(s.id)).length === 0 && (
              <div className="text-center py-6 text-slate-500">
                <p className="text-sm">Esta ruta no tiene colaboradores asignados.</p>
                <p className="text-xs mt-1">Edita la ruta para asignar colaboradores.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Rutas de Aprendizaje</h1><p className="text-sm text-slate-500 mt-0.5">{paths.length} rutas configuradas</p></div>
        <button onClick={() => { setMode("builder"); resetBuilder(); }} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Crear Ruta
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {paths.map(path => {
          const assigned = STAFF_DATA.filter(s => path.assignedStaff.includes(s.id));
          const doneStages = path.stages.filter((_, i) => i < 2).length;
          return (
            <div key={path.id} className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
              <div className="p-5 border-b border-white/8" style={{ background: `${path.color}10` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{path.icon}</span>
                    <div><h3 className="text-base font-bold text-white">{path.title}</h3><p className="text-xs text-slate-400 mt-0.5">{path.role} · {path.duration}</p></div>
                  </div>
                  {path.hasFinalExam && <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-semibold">🏅 Con examen</span>}
                </div>
                {path.description && <p className="text-xs text-slate-400 mt-3">{path.description}</p>}
              </div>
              <div className="p-5 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-500">Progreso de etapas</span><span className="text-white font-semibold">{doneStages}/{path.stages.length}</span></div>
                  <div className="flex gap-1">{path.stages.map((s, i) => <div key={s.id} className={`flex-1 h-2 rounded-full ${i < doneStages ? "" : "bg-white/10"}`} style={i < doneStages ? { background: path.color } : {}} />)}</div>
                </div>
                {/* Stages list */}
                <div className="space-y-1.5">
                  {path.stages.map((s, i) => (
                    <div key={s.id} className={`flex items-center gap-2.5 text-xs ${i < doneStages ? "text-slate-400" : i === doneStages ? "text-white font-semibold" : "text-slate-600"}`}>
                      {i < doneStages ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : i === doneStages ? <Activity className="w-3.5 h-3.5 flex-shrink-0" style={{ color: path.color }} /> : <Lock className="w-3.5 h-3.5 flex-shrink-0 text-slate-700" />}
                      <span>{s.period} — {s.title}</span>
                      <span className="text-slate-600 ml-auto">{s.modules.length} módulos</span>
                    </div>
                  ))}
                </div>
                {/* Assigned staff */}
                {assigned.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Colaboradores asignados ({assigned.length})</p>
                    <div className="flex -space-x-2">
                      {assigned.slice(0, 6).map(s => <div key={s.id} className="w-7 h-7 rounded-full border-2 border-[#141626] flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})` }}>{s.initials[0]}</div>)}
                      {assigned.length > 6 && <div className="w-7 h-7 rounded-full border-2 border-[#141626] bg-white/10 flex items-center justify-center text-xs text-slate-400">+{assigned.length - 6}</div>}
                    </div>
                  </div>
                )}
                {/* Tutor */}
                {path.tutorId && (() => {
                  const tutor = STAFF_DATA.find(s => s.id === path.tutorId);
                  return tutor ? (
                    <div className="flex items-center gap-2 bg-violet-500/8 border border-violet-500/20 rounded-xl px-3 py-2">
                      <Av initials={tutor.initials} from={tutor.gradientFrom} to={tutor.gradientTo} size="sm" />
                      <div><p className="text-xs text-violet-300 font-semibold">{tutor.name}</p><p className="text-xs text-slate-500">Tutor responsable</p></div>
                    </div>
                  ) : null;
                })()}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setSelPath(selPath?.id === path.id ? null : path)} className="flex-1 text-xs bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-xl transition-colors">
                    {selPath?.id === path.id ? "Cerrar detalle" : "Ver detalle"}
                  </button>
                  {path.hasFinalExam && path.examQuestions.length > 0 && (
                    <button onClick={() => setSelectStaffModal(path)} className="flex-1 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1" style={{ background: `${path.color}20`, color: path.color }}>
                      📝 Iniciar Examen
                    </button>
                  )}
                  {path.hasFinalExam && path.examQuestions.length === 0 && (
                    <span className="flex-1 text-xs text-center py-2 text-slate-600">Sin preguntas aún</span>
                  )}
                </div>
              </div>
              {selPath?.id === path.id && (
                <div className="border-t border-white/8 p-5 bg-white/2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detalle de módulos</h4>
                  <div className="space-y-3">
                    {path.stages.map((s, i) => (
                      <div key={s.id} className={`${i < doneStages ? "opacity-60" : ""}`}>
                        <p className="text-xs font-bold text-white mb-1">{s.period} — {s.title}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.modules.map((m, mi) => <span key={mi} className="text-xs bg-white/8 text-slate-300 px-2 py-0.5 rounded-full">{m}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationsView({ certs, setCerts, paths }: { certs: Certificate[]; setCerts: (c: Certificate[]) => void; paths: LearningPath[] }) {
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [tab, setTab] = useState<"issued" | "matrix">("issued");
  const [search, setSearch] = useState("");

  const filteredCerts = certs.filter(c => c.recipientName.toLowerCase().includes(search.toLowerCase()) || c.pathTitle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      {previewCert && <CertificatePreview cert={previewCert} onClose={() => setPreviewCert(null)} />}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Certificaciones</h1><p className="text-sm text-slate-500 mt-0.5">Certificados emitidos al completar rutas de aprendizaje</p></div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          {(["issued","matrix"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:text-white"}`}>
              {t === "issued" ? "🏅 Certificados emitidos" : "📊 Matriz del equipo"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total emitidos", value: certs.length, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Rutas con examen", value: paths.filter(p => p.hasFinalExam).length, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Tasa de aprobación", value: "87%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Sin certificaciones", value: STAFF_DATA.filter(s => s.certs.length === 0).length, color: "text-red-400", bg: "bg-red-500/10" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border border-white/10 rounded-2xl p-4`}>
            <p className={`text-3xl font-extrabold ${k.color}`}>{k.value}</p>
            <p className="text-sm text-slate-300 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {tab === "issued" && (
        <>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o ruta..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
          </div>
          {filteredCerts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-slate-400 text-sm">No hay certificados emitidos aún.</p>
              <p className="text-slate-600 text-xs mt-1">Los certificados se generan automáticamente al aprobar el examen final de una ruta.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredCerts.map(c => {
                const staff = STAFF_DATA.find(s => s.name === c.recipientName);
                return (
                  <div key={c.id} className="bg-[#141626] border border-white/10 rounded-2xl p-5 hover:border-amber-500/25 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      {staff && <Av initials={staff.initials} from={staff.gradientFrom} to={staff.gradientTo} size="md" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{c.recipientName}</p>
                        <p className="text-xs text-slate-500">{c.recipientRole}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.score >= 90 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{c.score}%</div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/20 rounded-xl p-3 mb-3">
                      <p className="text-xs font-bold text-indigo-300">🏅 {c.pathTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.certSubtitle}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>Emitido: {c.date}</span>
                      <span>ID: CERT-{String(c.id).padStart(5, "0")}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setPreviewCert(c)} className="flex-1 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Ver Certificado
                      </button>
                      <button className="flex-1 text-xs bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "matrix" && (
        <div className="bg-[#141626] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/8">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Colaborador</th>
              {CERT_TYPES.map(c => <th key={c.id} className="text-center text-xs font-semibold text-slate-500 px-3 py-3">{c.icon} {c.name}</th>)}
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Cobertura</th>
            </tr></thead>
            <tbody>
              {STAFF_DATA.map(s => {
                const coverage = Math.round(s.certs.length / CERT_TYPES.length * 100);
                return (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3"><Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                        <div><p className="text-sm font-medium text-white">{s.name}</p><p className="text-xs text-slate-500">{s.role}</p></div>
                      </div>
                    </td>
                    {CERT_TYPES.map(c => {
                      const has = s.certs.some(cert => cert.toLowerCase().includes(c.name.toLowerCase().split(" ")[0].toLowerCase()));
                      return <td key={c.id} className="px-3 py-3 text-center">{has ? <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />}</td>;
                    })}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/10 rounded-full"><div className={`h-full rounded-full ${coverage >= 60 ? "bg-emerald-500" : coverage >= 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${coverage}%` }} /></div>
                        <span className={`text-xs font-bold ${coverage >= 60 ? "text-emerald-400" : coverage >= 30 ? "text-amber-400" : "text-red-400"}`}>{coverage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function CalendarView() {
  const [selDay, setSelDay] = useState<number | null>(23);
  const [events, setEvents] = useState(CALENDAR_EVENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ day: "1", label: "", type: "event" as "quiz" | "cert" | "event" | "alert" });

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const firstDay = new Date(2026, 6, 1).getDay();
  const daysInMonth = 31;
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);
  const typeStyle: Record<string, string> = { quiz: "bg-indigo-500", cert: "bg-amber-500", event: "bg-violet-500", alert: "bg-red-500" };

  function addEvent() {
    if (!newEvent.label.trim()) return;
    const day = parseInt(newEvent.day);
    setEvents(prev => ({ ...prev, [day]: [...(prev[day] || []), { label: newEvent.label, type: newEvent.type }] }));
    setNewEvent({ day: "1", label: "", type: "event" });
    setShowAdd(false);
  }

  return (
    <div className="p-6 space-y-5">
      {showAdd && (
        <Modal title="Nuevo Evento" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Día del mes</label>
                <input type="number" min="1" max="31" value={newEvent.day} onChange={e => setNewEvent(p => ({ ...p, day: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none" />
              </div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Tipo</label>
                <select value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value as typeof newEvent.type }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none">
                  <option value="quiz" className="bg-[#141626]">📚 Reto</option>
                  <option value="cert" className="bg-[#141626]">🏅 Certificación</option>
                  <option value="event" className="bg-[#141626]">🎯 Evento</option>
                  <option value="alert" className="bg-[#141626]">🚨 Alerta</option>
                </select>
              </div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Descripción *</label>
              <input value={newEvent.label} onChange={e => setNewEvent(p => ({ ...p, label: e.target.value }))} placeholder="ej. Reto: Bioseguridad avanzada"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:border-indigo-500 outline-none" />
            </div>
            <button onClick={addEvent} disabled={!newEvent.label.trim()} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors">Agregar Evento</button>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Calendario Operativo</h1><p className="text-sm text-slate-500 mt-0.5">Retos, vencimientos y eventos especiales</p></div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3 text-xs">
            {[["bg-indigo-500","Reto"],["bg-amber-500","Certificación"],["bg-violet-500","Evento"],["bg-red-500","Alerta"]].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-slate-400"><div className={`w-2.5 h-2.5 rounded-full ${c}`} />{l}</div>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors"><Plus className="w-4 h-4" />Nuevo Evento</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-[#141626] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Julio 2026</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const evs = events[day] || [];
              const isToday = day === 23;
              const isSel = day === selDay;
              return (
                <button key={i} onClick={() => setSelDay(day === selDay ? null : day)}
                  className={`relative aspect-square flex flex-col items-center justify-start p-1.5 rounded-xl transition-all text-sm font-medium ${isSel ? "bg-indigo-500 text-white" : isToday ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}>
                  <span>{day}</span>
                  {evs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {evs.slice(0, 3).map((e, ei) => <div key={ei} className={`w-1.5 h-1.5 rounded-full ${typeStyle[e.type]}`} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          {selDay ? (
            <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">{selDay} de Julio 2026</h3>
              {(events[selDay] || []).length > 0 ? (
                <div className="space-y-2">
                  {(events[selDay] || []).map((e, i) => (
                    <div key={i} className={`rounded-xl p-3 border ${e.type === "quiz" ? "bg-indigo-500/10 border-indigo-500/20" : e.type === "cert" ? "bg-amber-500/10 border-amber-500/20" : e.type === "event" ? "bg-violet-500/10 border-violet-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                      <p className={`text-sm font-medium ${e.type === "quiz" ? "text-indigo-300" : e.type === "cert" ? "text-amber-300" : e.type === "event" ? "text-violet-300" : "text-red-300"}`}>{e.label}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">Sin eventos para este día.</p>}
              <button onClick={() => { setNewEvent(p => ({ ...p, day: String(selDay) })); setShowAdd(true); }} className="w-full mt-3 text-xs bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg transition-colors">+ Agregar evento en este día</button>
            </div>
          ) : (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Selecciona un día para ver sus eventos</p>
            </div>
          )}
          <div className="bg-[#141626] border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Próximos eventos</h3>
            <div className="space-y-2">
              {[23,25,28,30,31].map(d => (events[d] || []).slice(0, 1).map((e, i) => (
                <div key={`${d}-${i}`} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${e.type === "quiz" ? "bg-indigo-500/20 text-indigo-400" : "bg-violet-500/20 text-violet-400"}`}>{d}</div>
                  <p className="text-xs text-slate-300">{e.label}</p>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Portal ──────────────────────────────────────────────────────────

function EmployeePortal() {
  const [species, setSpecies] = useState<"canino" | "felino" | "exoticos">("canino");
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [emerTab, setEmerTab] = useState<"triage" | "rcp" | "anaphylaxis">("triage");

  const me = STAFF_DATA[0];
  const xpPct = Math.round((me.pts % 1000) / 10);
  const q = EMPLOYEE_QUIZ[currentQ];

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
  }
  function handleNext() {
    if (currentQ < EMPLOYEE_QUIZ.length - 1) { setCurrentQ(q => q + 1); setSelected(null); setAnswered(false); }
    else setFinished(true);
  }
  function resetQuiz() { setQuizActive(false); setCurrentQ(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); }

  return (
    <div className="flex h-full relative">
      {emergency && (
        <div className="absolute inset-0 z-50 bg-[#0A0C18]/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-white" /></div>
              <div><h2 className="text-lg font-bold text-white">Protocolos de Emergencia</h2><p className="text-xs text-red-400">Acceso rápido · 24/7</p></div>
            </div>
            <button onClick={() => setEmergency(false)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-2 px-6 pt-4">
            {([["triage","🚦 Triaje"],["rcp","❤️ RCP Animal"],["anaphylaxis","💉 Anafilaxia"]] as const).map(([t,l]) => (
              <button key={t} onClick={() => setEmerTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${emerTab === t ? "bg-red-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>{l}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
            {emerTab === "triage" && (
              <div className="grid grid-cols-4 gap-4">
                {[
                  { color: "bg-red-600", label: "🔴 ROJO — Inmediato", items: ["Paro cardiorrespiratorio","Shock hemorrágico","Convulsiones activas","Trauma craneoencefálico","Dificultad respiratoria severa"], time: "< 5 min" },
                  { color: "bg-amber-500", label: "🟡 AMARILLO — Urgente", items: ["Vómitos persistentes","Fractura con deformidad","Dolor intenso","Disnea leve-moderada","Temperatura > 40°C"], time: "< 30 min" },
                  { color: "bg-emerald-500", label: "🟢 VERDE — No Urgente", items: ["Heridas superficiales","Prurito sin compromiso","Cojera leve","Consulta de rutina","Control post-tratamiento"], time: "< 2h" },
                  { color: "bg-slate-700", label: "⬛ NEGRO", items: ["Rigidez cadavérica","Pupila fija bilateral","Sin signos vitales > 20 min","Lesiones incompatibles con vida"], time: "Paliativos" },
                ].map(t => (
                  <div key={t.label} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className={`${t.color} px-4 py-3`}><p className="text-white font-bold text-sm">{t.label}</p><p className="text-white/70 text-xs">{t.time}</p></div>
                    <div className="p-4"><ul className="space-y-1">{t.items.map((item, i) => <li key={i} className="text-xs text-slate-400 flex gap-2"><span className="text-slate-600">•</span>{item}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            )}
            {emerTab === "rcp" && (
              <div className="grid grid-cols-2 gap-5">
                {[
                  { sp: "🐕 CANINO", steps: ["Verificar inconsciencia — estimular suavemente","Decúbito lateral derecho en superficie dura","Permeabilizar vía aérea, extensión de cuello, tracción lingual","Masaje cardíaco: 100-120/min, profundidad 1/3 tórax","Ventilación: 2 respiraciones cada 30 compresiones","Adrenalina 0.01 mg/kg IV si no responde en 3-5 min"] },
                  { sp: "🐈 FELINO", steps: ["Verificar inconsciencia — cuidado con estrés extremo","Decúbito lateral derecho, no comprimir abdomen","Cuello extendido, tracción lingual suave","Técnica circunferencia torácica: 100-150/min","1 respiración cada 6 segundos (10/min)","Adrenalina 0.01 mg/kg IV. Atropina si bradicardia"] },
                ].map(s => (
                  <div key={s.sp} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-base font-bold text-white mb-4">{s.sp}</h3>
                    <div className="space-y-3">{s.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}</div>
                  </div>
                ))}
              </div>
            )}
            {emerTab === "anaphylaxis" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-3">🚨 Signos</h3>
                  <ul className="space-y-1.5">{["Urticaria y edema facial","Vómito y diarrea aguda","Hipotensión severa (shock)","Palidez de mucosas","Taquicardia / bradicardia","Colapso y pérdida de consciencia","Dificultad respiratoria súbita"].map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-red-500">•</span>{s}</li>)}</ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-amber-400 mb-3">⚡ Tratamiento</h3>
                  {[["1","Adrenalina 0.01 mg/kg IM","Primera línea. No demorar."],["2","Fluidoterapia 20ml/kg IV rápido","Expansión de volumen."],["3","Difenhidramina 1-2 mg/kg IV","Antihistamínico H1."],["4","Dexametasona 0.2 mg/kg IV","Si no responde a paso 1."]].map(([n,d,n2]) => (
                    <div key={n} className="border-b border-white/5 last:border-0 py-2">
                      <div className="flex gap-2 items-start"><span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                        <div><p className="text-xs font-bold text-amber-300">{d}</p><p className="text-xs text-slate-500">{n2}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-indigo-400 mb-3">📋 Causas Comunes</h3>
                  {[["Vacunas","Rabia, Leptospira, Bordetella"],["Medicamentos","Penicilinas, Sulfonamidas, AINEs"],["Biológicos","Sueros, Hemoderivados, Contrastes"]].map(([c,i]) => (
                    <div key={c} className="mb-2"><p className="text-xs font-bold text-indigo-300">{c}:</p><p className="text-xs text-slate-400">{i}</p></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-72 flex-shrink-0 border-r border-white/10 p-5 overflow-y-auto space-y-4" style={{ scrollbarWidth: "none" }}>
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-900/20 border border-indigo-500/20 rounded-2xl p-5 text-center">
          <Av initials={me.initials} from={me.gradientFrom} to={me.gradientTo} size="lg" />
          <h3 className="text-base font-bold text-white mt-3">{me.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{me.role} · {me.area}</p>
          <span className="inline-block mt-2 text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">⭐ Nivel 4 — Experto</span>
          <div className="mt-3"><div className="flex justify-between text-xs text-slate-500 mb-1"><span>XP</span><span>{me.pts % 1000}/1000</span></div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${xpPct}%` }} /></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["🏆","#1","Ranking"],["🔥",`${me.streak}d`,"Racha"],["⭐",me.pts.toLocaleString(),"Puntos"]].map(([ic,v,l]) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center"><p className="text-base">{ic}</p><p className="text-sm font-bold text-white">{v}</p><p className="text-xs text-slate-500">{l}</p></div>
          ))}
        </div>
        <button onClick={() => setEmergency(true)} className="w-full flex items-center gap-3 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 rounded-2xl px-4 py-3.5 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
          <div className="text-left"><p className="text-sm font-bold">Protocolo Emergencia</p><p className="text-xs text-red-400/60">Triaje · RCP · Anafilaxia</p></div>
        </button>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Mis Certificaciones</p>
          <div className="flex flex-wrap gap-1.5">{me.certs.map(c => <span key={c} className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{c}</span>)}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Próximos Retos</p>
          <div className="space-y-2">{INITIAL_QUIZZES.filter(q => q.status === "active").slice(0, 3).map(q => (
            <div key={q.id} className="flex items-center gap-2"><span className="text-base">{q.emoji}</span><div className="flex-1 min-w-0"><p className="text-xs text-white font-medium truncate">{q.title}</p><p className="text-xs text-slate-500">{q.area}</p></div></div>
          ))}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div><h2 className="text-xl font-bold text-white">¡Bienvenida, Ana! 👋</h2><p className="text-sm text-slate-500">Jueves 23 Jul · Turno Día · 7 días de racha 🔥</p></div>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {([["canino","🐕 Canino"],["felino","🐈 Felino"],["exoticos","🦜 Exóticos"]] as const).map(([v,l]) => (
              <button key={v} onClick={() => setSpecies(v)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${species === v ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:text-white"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: "none" }}>
          {!quizActive && !finished && (
            <>
              <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:brightness-110 transition-all" onClick={() => setQuizActive(true)}>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20">{species === "canino" ? "🐕" : species === "felino" ? "🐈" : "🦜"}</div>
                <div className="relative">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">RETO DEL DÍA</span>
                    <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full capitalize">{species}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl">{species === "canino" ? "Emergencias y Bioseguridad Canina" : species === "felino" ? "Manejo Felino Low-Stress" : "Cuidado de Animales Exóticos"}</h3>
                  <p className="text-orange-100 text-sm mt-1 mb-4">Área Médica · 3 preguntas · +150 pts</p>
                  <div className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-xl">Comenzar <span className="text-emerald-600">+150 pts</span> <ChevronRight className="w-4 h-4" /></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-violet-600/30 to-indigo-800/30 border border-violet-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">🏟️</div>
                  <div><h3 className="text-sm font-bold text-white">Desafío de Sede — Julio 2026</h3><p className="text-xs text-slate-400">Sede Norte vs Sede Sur · Termina en 8 días</p></div>
                  <span className="ml-auto bg-violet-500/20 text-violet-400 text-xs font-bold px-3 py-1 rounded-full border border-violet-500/30">EN VIVO</span>
                </div>
                <div className="flex items-center gap-2 mb-2"><span className="text-xs text-white font-semibold w-24">Sede Norte</span><div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: "72%" }} /></div><span className="text-xs font-bold text-indigo-400 w-12 text-right">72%</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-white font-semibold w-24">Sede Sur</span><div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-400 rounded-full" style={{ width: "48%" }} /></div><span className="text-xs font-bold text-red-400 w-12 text-right">48%</span></div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Módulos de Entrenamiento</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { emoji: "🏥", label: "Área Médica", pct: 78, bg: "bg-indigo-500/10 border-indigo-500/25" },
                    { emoji: "✂️", label: "Peluquería", pct: 91, bg: "bg-pink-500/10 border-pink-500/25" },
                    { emoji: "🛒", label: "PetShop", pct: 45, bg: "bg-emerald-500/10 border-emerald-500/25" },
                    { emoji: "🛡️", label: "Bioseguridad", pct: 100, bg: "bg-amber-500/10 border-amber-500/25" },
                    { emoji: "🚨", label: "Emergencias", pct: 60, bg: "bg-red-500/10 border-red-500/25" },
                    { emoji: "💊", label: "Farmacia", pct: 33, bg: "bg-violet-500/10 border-violet-500/25" },
                  ].map(m => (
                    <div key={m.label} className={`${m.bg} border rounded-2xl p-4 hover:scale-[1.02] transition-transform cursor-pointer`}>
                      <p className="text-2xl mb-2">{m.emoji}</p>
                      <p className="text-sm font-bold text-white">{m.label}</p>
                      <div className="h-1.5 bg-black/20 rounded-full mt-2"><div className="h-full bg-white/60 rounded-full" style={{ width: `${m.pct}%` }} /></div>
                      <p className="text-xs text-white/50 mt-1">{m.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {quizActive && !finished && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={resetQuiz} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex-1">
                  <div className="flex gap-1.5">{EMPLOYEE_QUIZ.map((_, i) => <div key={i} className={`flex-1 h-1.5 rounded-full ${i < currentQ ? "bg-indigo-500" : i === currentQ ? "bg-indigo-400" : "bg-white/15"}`} />)}</div>
                  <p className="text-xs text-slate-500 mt-1">Pregunta {currentQ + 1} de {EMPLOYEE_QUIZ.length}</p>
                </div>
              </div>
              <div className="bg-indigo-500/15 border border-indigo-500/25 rounded-xl px-4 py-2 mb-4"><p className="text-indigo-300 text-xs font-medium">{q.scenario}</p></div>
              <div className="bg-[#141626] border border-white/10 rounded-2xl p-5 mb-4 text-center">
                <p className="text-5xl mb-3">{q.emoji}</p>
                <p className="text-white font-semibold text-base leading-relaxed">{q.text}</p>
              </div>
              <div className="space-y-2.5 mb-4">
                {q.options.map((opt, i) => {
                  let cls = "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10";
                  if (answered) cls = i === q.correct ? "bg-emerald-500/20 border-emerald-500 text-emerald-200" : i === selected ? "bg-red-500/20 border-red-500 text-red-300" : "bg-white/3 border-white/8 text-slate-600";
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all ${cls}`}>
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${answered && i === q.correct ? "bg-emerald-500 text-white" : answered && i === selected ? "bg-red-500 text-white" : "bg-white/10 text-slate-400"}`}>
                        {answered && i === q.correct ? "✓" : answered && i === selected && i !== q.correct ? "✗" : String.fromCharCode(65 + i)}
                      </span>{opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`rounded-2xl border p-4 ${selected === q.correct ? "bg-emerald-500/15 border-emerald-500/30" : "bg-red-500/15 border-red-500/30"}`}>
                  <p className={`font-bold text-sm mb-1 ${selected === q.correct ? "text-emerald-400" : "text-red-400"}`}>{selected === q.correct ? "✅ ¡Correcto! +50 pts" : "❌ Incorrecto"}</p>
                  <p className="text-slate-300 text-xs">{q.explanation}</p>
                  <button onClick={handleNext} className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">{currentQ < EMPLOYEE_QUIZ.length - 1 ? "Siguiente →" : "Ver resultados →"}</button>
                </div>
              )}
            </div>
          )}

          {finished && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
              <p className="text-7xl">{score === EMPLOYEE_QUIZ.length ? "🏆" : score >= 2 ? "🎉" : "📚"}</p>
              <div><h3 className="text-2xl font-bold text-white">{score === EMPLOYEE_QUIZ.length ? "¡Perfecto!" : score >= 2 ? "¡Bien hecho!" : "Sigue practicando"}</h3></div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 text-center"><p className="text-3xl font-extrabold text-white">{score}/{EMPLOYEE_QUIZ.length}</p><p className="text-sm text-slate-400 mt-1">Correctas</p></div>
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-8 py-4 text-center"><p className="text-3xl font-extrabold text-emerald-400">+{score * 50}</p><p className="text-sm text-slate-400 mt-1">Puntos XP</p></div>
              </div>
              <button onClick={resetQuiz} className="bg-[#4F46E5] hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl transition-colors">Volver al inicio</button>
            </div>
          )}
        </div>
      </div>

      <div className="w-64 flex-shrink-0 border-l border-white/10 p-5 overflow-y-auto space-y-4" style={{ scrollbarWidth: "none" }}>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ranking · Esta semana</h3>
          <div className="space-y-2.5">
            {[...STAFF_DATA].sort((a, b) => b.pts - a.pts).slice(0, 7).map((s, i) => (
              <div key={s.id} className={`flex items-center gap-2.5 ${s.id === me.id ? "bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-2 py-1 -mx-2" : ""}`}>
                <span className="text-xs font-bold text-slate-500 w-4">#{i + 1}</span>
                <Av initials={s.initials} from={s.gradientFrom} to={s.gradientTo} size="sm" />
                <div className="flex-1 min-w-0"><p className={`text-xs font-medium truncate ${s.id === me.id ? "text-indigo-300" : "text-white"}`}>{s.name.split(" ")[0]}</p></div>
                <span className="text-xs font-bold text-slate-300">{(s.pts / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#141626] border border-white/10 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actividad Reciente</h3>
          <div className="space-y-3">
            {[
              { icon: "✅", label: "Completaste Bioseguridad", pts: "+40 pts", time: "Hace 2h" },
              { icon: "🏅", label: "Medalla: Guardián Bioseguro", pts: "+100 pts", time: "Ayer" },
              { icon: "🔥", label: "Racha activa de 14 días", pts: "+20 bonus", time: "Hoy" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2"><span className="text-base flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0"><p className="text-xs text-white font-medium leading-tight">{a.label}</p><p className="text-xs text-slate-500">{a.time}</p></div>
                <span className="text-xs text-emerald-400 font-bold flex-shrink-0">{a.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<"admin" | "employee">("admin");
  const [view, setView] = useState<View>("dashboard");
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [paths, setPaths] = useState<LearningPath[]>(INITIAL_PATHS);
  const [certs, setCerts] = useState<Certificate[]>(INITIAL_CERTS);

  function handleSaveQuiz(quiz: Quiz) { setQuizzes(prev => [quiz, ...prev]); setView("quizzes"); }

  const navItems: { id: View; icon: React.ReactNode; label: string }[] = [
    { id: "dashboard",      icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { id: "quizzes",        icon: <BookOpen className="w-4 h-4" />,         label: "Retos" },
    { id: "learning-paths", icon: <Layers className="w-4 h-4" />,           label: "Rutas de Aprendizaje" },
    { id: "heatmap",        icon: <Map className="w-4 h-4" />,              label: "Mapa de Riesgo" },
    { id: "staff",          icon: <Users className="w-4 h-4" />,            label: "Colaboradores" },
    { id: "certifications", icon: <FileCheck className="w-4 h-4" />,        label: "Certificaciones" },
    { id: "gamification",   icon: <Trophy className="w-4 h-4" />,           label: "Gamificación" },
    { id: "protocols",      icon: <Shield className="w-4 h-4" />,           label: "Protocolos" },
    { id: "calendar",       icon: <Calendar className="w-4 h-4" />,         label: "Calendario" },
    { id: "reports",        icon: <BarChart2 className="w-4 h-4" />,        label: "Reportes" },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0D0F1A] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header className="flex-shrink-0 flex items-center gap-4 px-5 py-3 border-b border-white/10 bg-[#0A0C18]">
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center"><Stethoscope className="w-3.5 h-3.5 text-white" /></div>
          <span className="text-sm font-bold text-white">VetLearn</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-medium">Operations</span>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          {(["admin","employee"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}>
              {m === "admin" ? <><LayoutDashboard className="w-3.5 h-3.5" />Panel Admin</> : <><User className="w-3.5 h-3.5" />Vista Empleado</>}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {mode === "admin" && <div className="bg-red-500/15 border border-red-500/25 rounded-lg px-3 py-1.5 flex items-center gap-2"><span className="text-sm">🚨</span><span className="text-xs font-semibold text-red-400">Sede Sur · Noche crítico</span></div>}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="text-sm text-white font-medium">Gerente General</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {mode === "admin" && (
          <>
            <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/10 bg-[#141626]">
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${view === item.id ? "bg-[#4F46E5] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    {item.icon}{item.label}
                  </button>
                ))}
              </nav>
              <div className="px-3 pb-4">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                  <Activity className="w-4 h-4" />Configuración
                </button>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {view === "dashboard"      && <DashboardView setView={setView} />}
              {view === "quizzes"        && <QuizListView quizzes={quizzes} setQuizzes={setQuizzes} setView={setView} />}
              {view === "quiz-builder"   && <QuizBuilderView onSave={handleSaveQuiz} />}
              {view === "heatmap"        && <HeatmapView />}
              {view === "staff"          && <StaffView />}
              {view === "gamification"   && <GamificationView />}
              {view === "reports"        && <ReportsView />}
              {view === "protocols"      && <ProtocolsView />}
              {view === "learning-paths" && <LearningPathsView paths={paths} setPaths={setPaths} certs={certs} setCerts={setCerts} />}
              {view === "certifications" && <CertificationsView certs={certs} setCerts={setCerts} paths={paths} />}
              {view === "calendar"       && <CalendarView />}
            </main>
          </>
        )}
        {mode === "employee" && <div className="flex-1 overflow-hidden"><EmployeePortal /></div>}
      </div>
    </div>
  );
}
