// ============================================================
// src/data/report.ts — All report content as typed data
// ============================================================

import type { ReportMeta, ChapterData, Finding } from '../types';

export const META: ReportMeta = {
  title: 'การผสานรวม Agentic AI\nกับแพลตฟอร์มแผนที่ดิจิทัล',
  subtitle:
    'กรณีศึกษาการใช้งานชุดเครื่องมือปัญญาประดิษฐ์เชิงพื้นที่\nและ MCP Server ของ Google Maps',
  course: '477-401 สัมมนาระบบสารสนเทศทางธุรกิจ',
  semester: 'ภาคเรียนที่ 1 ปีการศึกษา 2569',
  authors: [
    { name: 'นาย คมกฤช โพธิ์นิ่มแดง', studentId: '6610510043', initials: 'KP' },
    { name: 'นางสาว ณัฎฐณิชา เมฆปลัด', studentId: '6610510095', initials: 'NM' },
  ],
  advisor: 'ผู้ช่วยศาสตราจารย์ ดร.รุชดี บิลหมัด',
  tags: ['Agentic AI', 'Google Maps', 'MCP Server', 'Context Engineering', 'GIS', 'Builder Agent'],
};

export const FINDINGS: Finding[] = [
  { value: '70–80%', label: 'ลด Boilerplate Code' },
  { value: '8 นาที', label: 'ขับรถ ม.อ. → The Company' },
  { value: '9 routes', label: 'จาก maps_directions' },
  { value: '4 องค์ประกอบ', label: 'Builder Agent Architecture' },
];

export const CHAPTERS: ChapterData[] = [
  // ========================================================
  // CHAPTER 1 — บทนำ
  // ========================================================
  {
    id: 'ch1',
    num: 'บทที่ 1',
    title: 'บทนำ',
    desc: 'ระบบสารสนเทศเชิงพื้นที่ (GIS) มีบทบาทสำคัญในธุรกิจยุคใหม่ ตั้งแต่ระบบจองโรงแรม แอปพลิเคชันจัดส่งอาหาร ไปจนถึงแดชบอร์ดสำหรับผู้ดูแลระบบ การเข้ามาของ AI Agent และ LLMs จึงเป็นปัจจัยสำคัญในการปฏิวัติกระบวนการพัฒนาซอฟต์แวร์',
    pills: [
      { id: 'all', label: 'ทั้งหมด', count: 3 },
      { id: 'background', label: 'ความเป็นมา' },
      { id: 'objective', label: 'วัตถุประสงค์' },
      { id: 'benefit', label: 'ประโยชน์' },
    ],
    rows: [
      {
        id: 'r1-1',
        category: 'background',
        tag: '1.1',
        title: 'ความเป็นมาและความสำคัญ',
        body: 'GIS เป็นส่วนสำคัญของธุรกิจยุคใหม่ในหลายอุตสาหกรรม การบูรณาการ Maps API หลายตัวพร้อมกันนั้นซับซ้อนและใช้ทรัพยากรสูง AI Agent จึงเข้ามาช่วยลดภาระงานนักพัฒนาได้อย่างมีนัยสำคัญ',
        chips: ['GIS', 'Google Maps API', 'AI Agent', 'LLM'],
        code: {
          lang: 'typescript',
          label: 'ตัวอย่าง: Legacy Maps Integration',
          code: `// ❌ แบบเก่า — ต้องเขียนโค้ดทุกอย่างเอง
const map = new google.maps.Map(el, { zoom: 14, center: origin });
const service = new google.maps.places.PlacesService(map);
service.nearbySearch({
  location: origin,
  radius: 1500,
  type: 'cafe',
}, (results, status) => {
  if (status !== google.maps.places.PlacesServiceStatus.OK) return;
  results?.forEach(place => addMarker(place));
});

// ✅ แบบใหม่ — ด้วย MCP + AI Agent
const results = await mcpClient.callTool('maps_search_places', {
  query: 'ร้านกาแฟใกล้ มหาวิทยาลัยสงขลานครินทร์',
  location: 'Hat Yai, Songkhla',
  radius: 1500,
});`,
        },
      },
      {
        id: 'r1-2',
        category: 'objective',
        tag: '1.2',
        title: 'วัตถุประสงค์การวิจัย',
        body: '',
        list: [
          'ศึกษาหลักการทำงานและสถาปัตยกรรมของระบบ Builder Agent',
          'ศึกษามาตรฐาน Model Context Protocol (MCP) และการประยุกต์ใช้งาน',
          'สร้างระบบต้นแบบที่ประยุกต์ใช้ Context Engineering กับ Interactive Maps',
          'เปรียบเทียบประสิทธิภาพของ Agentic AI กับระบบ Rule-Based แบบดั้งเดิม',
        ],
      },
      {
        id: 'r1-3',
        category: 'benefit',
        tag: '1.3',
        title: 'ประโยชน์ที่คาดว่าจะได้รับ',
        body: '',
        list: [
          'เข้าใจกระบวนการทำงานของ AI Agent และ MCP ในงานพัฒนาเว็บ Google Maps',
          'ยกระดับการพัฒนา AI โดยป้องกันปัญหา Context Overflow และ Hallucinations',
          'สร้างระบบที่เชื่อถือได้และปราศจากความผิดพลาดของข้อมูล',
          'ลดเวลาการพัฒนาฟีเจอร์แผนที่จากหลายวันเหลือเพียงไม่กี่นาที',
        ],
      },
    ],
  },

  // ========================================================
  // CHAPTER 2 — ทฤษฎีที่เกี่ยวข้อง
  // ========================================================
  {
    id: 'ch2',
    num: 'บทที่ 2',
    title: 'แนวคิดและทฤษฎีที่เกี่ยวข้อง',
    desc: 'รายงานนี้ผสมผสานแนวคิดหลัก 6 ด้าน ตั้งแต่พื้นฐาน AI Agent จนถึงการประยุกต์ใช้กับ Google Maps Platform',
    pills: [
      { id: 'all', label: 'ทั้งหมด', count: 6 },
      { id: 'agent', label: 'AI Agent' },
      { id: 'mcp', label: 'MCP' },
      { id: 'context', label: 'Context Engineering' },
      { id: 'maps', label: 'Google Maps AI' },
    ],
    rows: [
      {
        id: 'r2-1',
        category: 'agent',
        tag: '2.1',
        title: 'เทคโนโลยี AI Agent',
        subtitle: 'และสถาปัตยกรรม Builder Agent',
        body: 'AI Agent คือระบบที่รับรู้สภาพแวดล้อมและตัดสินใจอิสระ Builder Agent ประกอบด้วย 4 ส่วนหลัก: NLU Engine, Code Synthesis, UI Generator, และ Context Integrator',
        badge: 'AI Agent',
        components: [
          { icon: '🧠', name: 'NLU Engine', desc: 'วิเคราะห์ความตั้งใจ' },
          { icon: '⚙️', name: 'Code Synthesis', desc: 'สร้างโค้ดอัตโนมัติ' },
          { icon: '🖼️', name: 'UI Generator', desc: 'สร้าง Layout' },
          { icon: '🔗', name: 'Context Integrator', desc: 'บูรณาการบริบท' },
        ],
        code: {
          lang: 'typescript',
          label: 'Builder Agent — TypeScript Interface',
          code: `interface BuilderAgentConfig {
  nluEngine: NLUEngine;
  codeSynthesizer: CodeSynthesizer;
  uiGenerator: UIGenerator;
  contextIntegrator: ContextIntegrator;
}

interface AgentTask {
  userPrompt: string;
  context: Map<string, unknown>;
  tools: MCPTool[];
}

class BuilderAgent {
  private config: BuilderAgentConfig;

  constructor(config: BuilderAgentConfig) {
    this.config = config;
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    // 1. Understand intent
    const intent = await this.config.nluEngine.parse(task.userPrompt);
    // 2. Integrate context
    const ctx = this.config.contextIntegrator.build(task.context, intent);
    // 3. Synthesize code
    const code = await this.config.codeSynthesizer.generate(intent, ctx);
    // 4. Generate UI
    const ui = this.config.uiGenerator.render(code);
    return { intent, code, ui };
  }
}`,
        },
      },
      {
        id: 'r2-2',
        category: 'mcp',
        tag: '2.2',
        title: 'Model Context Protocol',
        subtitle: 'มาตรฐาน MCP',
        body: 'โปรโตคอลเปิดสำหรับเชื่อมต่อ LLM เข้ากับแหล่งข้อมูลและเครื่องมือภายนอกอย่างปลอดภัย',
        badge: 'MCP',
        mcpFlow: [
          { label: 'Host', sublabel: 'แอปพลิเคชัน' },
          { label: 'Client', sublabel: 'ตัวเชื่อม LLM', highlight: true },
          { label: 'Server', sublabel: 'ให้บริการ Tools' },
        ],
        code: {
          lang: 'typescript',
          label: 'MCP Client — เชื่อมต่อ Google Maps Server',
          code: `import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-google-maps'],
  env: { GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY! },
});

const mcpClient = new Client(
  { name: 'seminar-client', version: '1.0.0' },
  { capabilities: {} }
);

await mcpClient.connect(transport);

// List available tools
const { tools } = await mcpClient.listTools();
console.log('Available MCP tools:', tools.map(t => t.name));
// → ['maps_geocode', 'maps_search_places', 'maps_directions',
//    'maps_distance_matrix', 'maps_explore_area', ...]`,
        },
      },
      {
        id: 'r2-3',
        category: 'context',
        tag: '2.3',
        title: 'Context Engineering',
        subtitle: 'วิศวกรรมบริบท',
        body: 'เทคนิคการป้อนบริบทเฉพาะทางเชิงพื้นที่เพื่อให้ AI เข้าใจพิกัด ข้อมูลสถานที่ และเงื่อนไขการเดินทาง ช่วยป้องกัน Context Overflow และลด Hallucination',
        badge: 'Context',
        code: {
          lang: 'typescript',
          label: 'Context Engineering — สร้าง Spatial Context',
          code: `interface SpatialContext {
  userLocation: LatLng;
  searchRadius: number;
  travelMode: 'DRIVING' | 'WALKING' | 'TRANSIT';
  businessType: string;
  timeOfDay: string;
}

function buildSpatialSystemPrompt(ctx: SpatialContext): string {
  return \`You are a GIS expert assistant for business analytics.
Current context:
- User location: \${ctx.userLocation.lat}, \${ctx.userLocation.lng}
- Search radius: \${ctx.searchRadius}m
- Travel mode: \${ctx.travelMode}
- Target business type: \${ctx.businessType}
- Time: \${ctx.timeOfDay}

Always use real-time data from MCP tools.
Never hallucinate coordinates or place names.
Verify all place_id before using in results.\`;
}`,
        },
      },
      {
        id: 'r2-4',
        category: 'maps',
        tag: '2.4',
        title: 'Generative AI สำหรับการค้นหาเชิงบริบท',
        subtitle: 'Contextual Place Search',
        body: 'Generative AI ช่วยให้การค้นหาสถานที่เข้าใจบริบทมากขึ้น รวมทั้ง Immersive View for Routes',
        badge: 'Maps AI',
        code: {
          lang: 'typescript',
          label: 'Contextual Search — Google Places + Gemini',
          code: `async function searchCafesNearPSU(): Promise<PlaceResult[]> {
  // Step 1: Use MCP to search places
  const searchResult = await mcpClient.callTool(
    'maps_search_places',
    {
      query: 'ร้านกาแฟบรรยากาศดีใกล้มหาวิทยาลัย',
      location: 'Prince of Songkla University, Hat Yai',
      radius: 1500,
      type: 'cafe',
    }
  );

  // Step 2: Use Gemini to rank by context
  const ranked = await gemini.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: \`Rank these cafes for a student wanting to study:
\${JSON.stringify(searchResult.places)}
Consider: WiFi, quiet atmosphere, opening hours\`,
      }],
    }],
  });

  return parseRankedResults(ranked.response.text());
}`,
        },
      },
      {
        id: 'r2-5',
        category: 'maps',
        tag: '2.5',
        title: 'Logistics & Route Optimization',
        subtitle: 'การเพิ่มประสิทธิภาพเส้นทาง',
        body: 'Fleet Routing API และ Route Optimization สำหรับการวางแผนจัดส่งสินค้าหลายจุด',
        badge: 'Maps AI',
        code: {
          lang: 'typescript',
          label: 'Route Optimization — Distance Matrix',
          code: `interface RouteRequest {
  origin: string;
  destination: string;
  waypoints?: string[];
  travelMode: TravelMode;
}

async function analyzeRoute(req: RouteRequest): Promise<RouteAnalysis> {
  const [directionsResult, distanceMatrix] = await Promise.all([
    mcpClient.callTool('maps_directions', {
      origin: req.origin,
      destination: req.destination,
      mode: req.travelMode.toLowerCase(),
    }),
    mcpClient.callTool('maps_distance_matrix', {
      origins: [req.origin],
      destinations: [req.destination],
      mode: req.travelMode.toLowerCase(),
    }),
  ]);

  return {
    routes: directionsResult.routes,
    duration: distanceMatrix.rows[0].elements[0].duration.text,
    distance: distanceMatrix.rows[0].elements[0].distance.text,
    // Example: ม.อ. หาดใหญ่ → The Company
    // Driving: 8 minutes, Walking: 30 minutes
  };
}`,
        },
      },
      {
        id: 'r2-6',
        category: 'maps',
        tag: '2.6',
        title: 'Cloud-based Maps Styling',
        subtitle: 'การปรับแต่งแผนที่บนคลาวด์',
        body: 'ระบบ Map ID สำหรับจัดการสไตล์แผนที่แบบรวมศูนย์ พร้อม AI Styling Assistant',
        badge: 'Maps AI',
        code: {
          lang: 'json',
          label: 'Map Style — Dark Mode JSON Schema',
          code: `[
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#0f1923" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#1de9b6" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#1a2d3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#0a1e2e" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#061017" }]
  }
]`,
        },
      },
    ],
  },

  // ========================================================
  // CHAPTER 3 — วิธีการดำเนินงาน
  // ========================================================
  {
    id: 'ch3',
    num: 'บทที่ 3',
    title: 'วิธีการดำเนินงานและการทดลองระบบ',
    desc: 'การทดลองแบ่งเป็น 2 ส่วนหลัก: Builder Agent Prototyping และ MCP Server Integration โดยใช้ Cline, Google AI Studio, VS Code และ MCP Google Maps Server',
    pills: [
      { id: 'all', label: 'ทั้งหมด', count: 8 },
      { id: 'builder', label: 'Builder Agent' },
      { id: 'mcp-exp', label: 'MCP Server' },
      { id: 'app', label: 'App Initialization' },
    ],
    rows: [
      {
        id: 'r3-1',
        category: 'builder',
        tag: '3.1',
        title: 'การตั้งค่าระบบ Builder Agent',
        subtitle: 'Builder Agent Setup',
        body: 'ติดตั้ง Cline ใน VS Code, กำหนด System Prompt, เชื่อมต่อ Google Maps API Key และตั้งค่า Workspace สำหรับการสร้างต้นแบบ',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'json',
          label: '.cline/cline_mcp_settings.json',
          code: `{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-maps"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "\${env:GOOGLE_MAPS_API_KEY}"
      },
      "disabled": false,
      "alwaysAllow": [
        "maps_geocode",
        "maps_search_places",
        "maps_directions",
        "maps_distance_matrix"
      ]
    }
  }
}`,
        },
      },
      {
        id: 'r3-2',
        category: 'builder',
        tag: '3.2',
        title: 'สร้างต้นแบบ GIS',
        subtitle: 'ร้านกาแฟรอบ ม.อ. หาดใหญ่',
        body: 'สั่ง Builder Agent สร้างหน้าแผนที่แสดงร้านกาแฟรอบมหาวิทยาลัยสงขลานครินทร์ โดยใช้ Places API และ AdvancedMarkerElement',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'typescript',
          label: 'GIS Prototype — AdvancedMarkerElement',
          code: `import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'marker'],
});

const { Map } = await loader.importLibrary('maps');
const { AdvancedMarkerElement } = await loader.importLibrary('marker');

const map = new Map(document.getElementById('map')!, {
  center: { lat: 7.0066, lng: 100.5018 }, // PSU Hat Yai
  zoom: 15,
  mapId: import.meta.env.VITE_MAP_ID,
});

// Search for cafes via MCP tool call
const cafes = await mcpClient.callTool('maps_search_places', {
  query: 'coffee cafe ร้านกาแฟ',
  location: '7.0066,100.5018',
  radius: 1500,
});

// Add markers
cafes.places.forEach((place: PlaceResult) => {
  const marker = new AdvancedMarkerElement({
    map,
    position: place.geometry.location,
    title: place.name,
  });
});`,
        },
      },
      {
        id: 'r3-3',
        category: 'builder',
        tag: '3.3',
        title: 'Maps Styling Agent',
        subtitle: 'Cloud-based Map Styling via AI Studio',
        body: 'ใช้ Google AI Studio สร้าง Maps Styling Agent ส่งคำสั่งปรับ Dark Mode, Feature Visibility และ Label Style แล้วส่งออก JSON Schema',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'typescript',
          label: 'Maps Styling Agent — System Instructions',
          code: `const STYLING_AGENT_PROMPT = \`
You are a Google Maps Styling Expert.
You help users create beautiful map styles for their web applications.

When the user asks to change map appearance:
1. Generate valid Google Maps JSON style array
2. Explain each style rule you're applying
3. Preview the result with a description

Available style targets:
- featureType: road, poi, water, landscape, transit, administrative
- elementType: geometry, geometry.fill, geometry.stroke, labels, labels.text
- stylers: color, visibility, weight, saturation, lightness

Always validate:
- Colors must be valid hex (#rrggbb format)
- Visibility: visible | simplified | off
- Output must be valid JSON array
\`;

// Example request:
// "สร้าง Dark Mode แผนที่สีดำ ตัวอักษร teal"
// → Agent generates JSON style + explanation`,
        },
      },
      {
        id: 'r3-4',
        category: 'mcp-exp',
        tag: '3.4',
        title: 'MCP Server Installation',
        subtitle: 'การติดตั้ง MCP Client',
        body: 'ติดตั้ง @modelcontextprotocol/server-google-maps ผ่าน npm เชื่อมต่อกับ Cline ใน VS Code',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'bash',
          label: 'Terminal — Install & Run MCP Server',
          code: `# Install MCP Google Maps server
npm install -g @modelcontextprotocol/server-google-maps

# Set environment variable
export GOOGLE_MAPS_API_KEY="AIza..."

# Run MCP server (Cline will auto-connect)
npx @modelcontextprotocol/server-google-maps

# Verify connection in Cline
# → 🟢 google-maps MCP connected
# → Tools available: maps_geocode, maps_search_places,
#                    maps_directions, maps_distance_matrix,
#                    maps_explore_area, maps_elevation`,
        },
      },
      {
        id: 'r3-5',
        category: 'mcp-exp',
        tag: '3.5',
        title: 'Place Search Testing',
        subtitle: 'ทดสอบค้นหาสถานที่',
        body: 'ทดสอบค้นหาร้านกาแฟรอบ ม.อ. หาดใหญ่ ผ่าน MCP Tool Call พบปัญหา google-map-id configuration ใน AdvancedMarkerElement',
        badge: 'แก้ไขแล้ว',
        badgeVariant: 'warn',
        code: {
          lang: 'typescript',
          label: 'Bug Fix — Map ID Configuration',
          code: `// ❌ ปัญหา: AdvancedMarkerElement ต้องการ mapId
const map = new Map(el, {
  center: PSU_COORDS,
  zoom: 15,
  // mapId ขาดหาย → AdvancedMarkerElement ไม่ทำงาน
});

// ❌ Error: "AdvancedMarkerElement requires a Map with a mapId"

// ✅ แก้ไข Option 1: ใช้ Map ID จาก Cloud Console
const map = new Map(el, {
  center: PSU_COORDS,
  zoom: 15,
  mapId: import.meta.env.VITE_MAP_ID, // เพิ่ม mapId
});

// ✅ แก้ไข Option 2: Fallback to legacy Marker
import { Marker } from '@googlemaps/js-api-loader';
const marker = new Marker({ map, position: place.geometry.location });

// ✅ แก้ไข Option 3: Mock Map ID for development
mapId: 'DEMO_MAP_ID' // ใช้ได้ใน dev mode`,
        },
      },
      {
        id: 'r3-6',
        category: 'mcp-exp',
        tag: '3.6',
        title: 'Routing & Distance Analysis',
        subtitle: 'ม.อ. หาดใหญ่ → ร้าน The Company',
        body: 'ทดสอบ maps_directions และ maps_distance_matrix หาเส้นทาง: ขับรถ 8 นาที / เดิน 30 นาที รวม 9 เส้นทาง และ 91 ข้อความ',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'typescript',
          label: 'Routing Result — ม.อ. → The Company',
          code: `const routeResult = await mcpClient.callTool('maps_directions', {
  origin: 'Prince of Songkla University, Hat Yai',
  destination: 'The Company Coffee, Hat Yai',
  mode: 'driving',
  alternatives: true,
});

// Result summary:
// ✅ 9 alternative routes found
// ✅ 91 step-by-step instructions
//
// Route 1 (Fastest):
//   🚗 Driving:  8 minutes, 3.2 km
//   🚶 Walking: 30 minutes, 2.8 km
//   🚌 Transit: 15 minutes (1 bus)
//
// Distance Matrix:
const matrix = await mcpClient.callTool('maps_distance_matrix', {
  origins: ['PSU Hat Yai'],
  destinations: ['The Company Coffee Hat Yai'],
  mode: 'driving',
});
// → { duration: '8 mins', distance: '3.2 km' }`,
        },
      },
      {
        id: 'r3-7',
        category: 'app',
        tag: '3.7',
        title: 'App Initialization',
        subtitle: 'AI Mapping Workforce via Google AI Studio',
        body: 'สร้าง App ใหม่ใน Google AI Studio กำหนด System Instructions บทบาทผู้เชี่ยวชาญ GIS วิเคราะห์ข้อมูลเชิงธุรกิจ',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'typescript',
          label: 'AI Studio App — GIS Expert System Instructions',
          code: `const GIS_EXPERT_SYSTEM = \`
You are an expert GIS Business Analyst specializing in
Thai retail and hospitality sectors.

Your capabilities:
- Analyze foot traffic patterns from Maps data
- Identify optimal store locations using demographic data
- Calculate delivery zones and logistics efficiency
- Compare competitor locations using geospatial analysis

Tools available (via MCP):
- maps_search_places: Search for businesses by type/area
- maps_explore_area: Get area overview and statistics
- maps_directions: Calculate routes and travel times
- maps_distance_matrix: Batch distance calculations

Response format:
1. Provide quantitative analysis with actual coordinates
2. Include confidence scores for recommendations
3. Always cite data sources (Places API, actual user data)
4. Flag any data limitations or coverage gaps
\`;`,
        },
      },
      {
        id: 'r3-8',
        category: 'app',
        tag: '3.8',
        title: 'Tool Integration & Safety Controls',
        subtitle: 'เชื่อม MCP Tools + ความปลอดภัย',
        body: 'เชื่อม MCP Tools ทั้งหมดเข้ากับ App พร้อมกำหนด Permission, Rate Limiting และ Budget Control',
        badge: 'สำเร็จ',
        badgeVariant: 'pos',
        code: {
          lang: 'typescript',
          label: 'Safety Controls — Rate Limit & Budget Guard',
          code: `class SafeMCPWrapper {
  private callCount = 0;
  private readonly maxCallsPerSession = 100;
  private budget = 0; // USD cents

  constructor(
    private client: MCPClient,
    private readonly budgetLimit: number = 500, // $5 limit
  ) {}

  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    // Rate limit guard
    if (this.callCount >= this.maxCallsPerSession) {
      throw new Error('Rate limit exceeded for this session');
    }

    // Budget guard
    const estimatedCost = this.estimateCost(name);
    if (this.budget + estimatedCost > this.budgetLimit) {
      throw new Error(\`Budget limit (\${this.budgetLimit}¢) exceeded\`);
    }

    const result = await this.client.callTool(name, args);
    this.callCount++;
    this.budget += estimatedCost;
    return result;
  }

  private estimateCost(toolName: string): number {
    const costs: Record<string, number> = {
      maps_search_places: 3,    // $0.03 per call
      maps_directions: 1,       // $0.01 per call
      maps_distance_matrix: 5,  // $0.05 per call
      maps_geocode: 0.5,        // $0.005 per call
    };
    return costs[toolName] ?? 1;
  }
}`,
        },
      },
    ],
  },

  // ========================================================
  // CHAPTER 4 — ผลการทดลอง
  // ========================================================
  {
    id: 'ch4',
    num: 'บทที่ 4',
    title: 'ผลการทดลองและปัญหาอุปสรรค',
    desc: 'เปรียบเทียบ Rule-Based กับ Agentic AI และ MCP พร้อมวิเคราะห์ผลกระทบต่อผู้มีส่วนได้ส่วนเสีย และปัญหาอุปสรรคจากการดำเนินงาน',
    pills: [
      { id: 'all', label: 'ทั้งหมด', count: 5 },
      { id: 'compare', label: 'การเปรียบเทียบ' },
      { id: 'impact', label: 'ผลกระทบ' },
      { id: 'challenge', label: 'ปัญหาอุปสรรค' },
    ],
    compareMode: true,
    rows: [
      {
        id: 'r4-1',
        category: 'compare',
        tag: '4.1',
        title: 'เวลาพัฒนา',
        body: '',
        colLeft: 'หลายวัน–สัปดาห์',
        colRight: 'ไม่กี่นาที–ชั่วโมง',
      },
      {
        id: 'r4-2',
        category: 'compare',
        tag: '4.2',
        title: 'ความแม่นยำข้อมูลพิกัด',
        body: '',
        colLeft: 'Manual Geocoding, Error-prone',
        colRight: 'Real-time API, Auto-verified',
      },
      {
        id: 'r4-3',
        category: 'compare',
        tag: '4.3',
        title: 'ความยืดหยุ่น',
        body: '',
        colLeft: 'ต้องเขียนโค้ดใหม่ทุกครั้ง',
        colRight: 'ปรับตามบริบทได้อัตโนมัติ',
      },
      {
        id: 'r4-4',
        category: 'impact',
        tag: '4.4',
        title: 'ผลกระทบต่อผู้มีส่วนได้ส่วนเสีย',
        body: '',
        list: [
          'นักพัฒนา: ลดเวลา Boilerplate Code ลง 70–80% มีเวลาโฟกัส Business Logic',
          'ผู้บริหาร: ลดต้นทุนพัฒนา เร่ง Time-to-Market และ ROI สูงขึ้น',
          'ผู้ใช้ปลายทาง: UX ดีขึ้น ข้อมูลเรียลไทม์ แผนที่ตอบสนองบริบทมากขึ้น',
        ],
        code: {
          lang: 'typescript',
          label: 'Before/After MCP — Code Comparison',
          code: `// ❌ BEFORE MCP: ต้องจัดการทุกอย่างเอง (50+ lines)
async function findNearbyPlaces(lat: number, lng: number) {
  const response = await fetch(
    \`https://maps.googleapis.com/maps/api/place/nearbysearch/json\` +
    \`?location=\${lat},\${lng}&radius=1500&type=cafe\` +
    \`&key=\${API_KEY}\`
  );
  const data = await response.json();
  if (data.status !== 'OK') throw new Error(data.error_message);
  return data.results.map(normalizePlace); // manual normalization
}

// ✅ AFTER MCP: 5 lines, real-time, AI-powered
const places = await agent.callTool('maps_search_places', {
  query: 'ร้านกาแฟ',
  location: \`\${lat},\${lng}\`,
  radius: 1500,
});
// Auto-normalized, ranked by AI, real-time data`,
        },
      },
      {
        id: 'r4-5',
        category: 'challenge',
        tag: '4.5',
        title: 'ปัญหาและข้อจำกัด',
        body: '',
        list: [
          '⚠ Rate Limit: API Google Maps มีโควตาจำกัด ต้องบริหารงบประมาณ',
          '⚠ API Key Security: ต้องตั้งค่า Restriction และ Environment Variables',
          '⚠ MCP Configuration: ปัญหา Map ID ใน AdvancedMarkerElement ต้องปรับ',
          '⚠ Context Window: การจัดการ Context Overflow ใน Long Sessions',
        ],
        code: {
          lang: 'typescript',
          label: 'Context Overflow Prevention',
          code: `class ContextManager {
  private readonly MAX_TOKENS = 128_000; // Gemini 1.5 Pro limit
  private tokenCount = 0;
  private history: Message[] = [];

  addMessage(msg: Message): void {
    const tokens = estimateTokens(msg.content);

    // Overflow prevention: summarize old history
    if (this.tokenCount + tokens > this.MAX_TOKENS * 0.8) {
      this.compressHistory();
    }

    this.history.push(msg);
    this.tokenCount += tokens;
  }

  private async compressHistory(): Promise<void> {
    const toCompress = this.history.slice(0, -5); // keep last 5
    const summary = await gemini.summarize(toCompress);
    this.history = [
      { role: 'system', content: \`[Compressed history]: \${summary}\` },
      ...this.history.slice(-5),
    ];
    this.tokenCount = estimateTokens(this.history);
  }
}`,
        },
      },
    ],
  },
];

export const REFERENCES = [
  {
    num: '[1]',
    text: 'Google LLC. (2024). Google Maps Platform Documentation: Places API. Google Developers. https://developers.google.com/maps/documentation/places/web-service',
  },
  {
    num: '[2]',
    text: 'Anthropic. (2024). Model Context Protocol Specification. MCP Documentation. https://modelcontextprotocol.io/',
  },
  {
    num: '[3]',
    text: 'Google LLC. (2024). Google AI Studio: Gemini API Documentation. Google AI. https://ai.google.dev/gemini-api/docs',
  },
  {
    num: '[4]',
    text: 'Cline. (2024). Cline: AI Coding Agent for VS Code. GitHub Repository. https://github.com/cline/cline',
  },
  {
    num: '[5]',
    text: 'Google LLC. (2024). Cloud-based Maps Styling. Google Maps Platform. https://developers.google.com/maps/documentation/cloud-styling',
  },
  {
    num: '[6]',
    text: 'Google LLC. (2024). Fleet Routing API for Logistics Optimization. Google Maps Platform. https://developers.google.com/maps/documentation/route-optimization',
  },
];
