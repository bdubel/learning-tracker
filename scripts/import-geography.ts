import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Path to Applied Geography files
const OBSIDIAN_PATH = '/Users/bobbydubel/Library/Mobile Documents/iCloud~md~obsidian/Documents/Obsidian/Learning/Applied Geography'

interface SectionData {
  code: string
  name: string
  deadline: string
  topics: string[]
  resources: Array<{ name: string; url?: string; description?: string }>
  progressionRequirements: Array<{ content: string; children?: Array<{ content: string }> }>
}

function parseMarkdownSection(filePath: string): SectionData | null {
  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const sectionData: SectionData = {
    code: '',
    name: '',
    deadline: '',
    topics: [],
    resources: [],
    progressionRequirements: [],
  }

  let currentSection = ''
  let currentRequirement: any = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Parse header
    if (line.startsWith('# ')) {
      sectionData.name = line.substring(2).trim()
      const match = sectionData.name.match(/^(\w+):/)
      if (match) {
        sectionData.code = match[1]
      }
    }

    // Parse deadline
    if (line.startsWith('**Deadline:')) {
      const deadlineMatch = line.match(/\*\*Deadline:\s*(.+)\*\*/)
      if (deadlineMatch) {
        sectionData.deadline = deadlineMatch[1].trim()
      }
    }

    // Track sections
    if (line.startsWith('## ')) {
      currentSection = line.substring(3).trim()
      currentRequirement = null
    }

    // Parse topics
    if (currentSection === 'Topics' && line.startsWith('- [ ]')) {
      const topic = line.substring(5).trim()
      if (topic) {
        sectionData.topics.push(topic)
      }
    }

    // Parse resources
    if (currentSection === 'Resources' && line.startsWith('- ')) {
      const resource = line.substring(2).trim()
      if (resource) {
        sectionData.resources.push({ name: resource })
      }
    }

    // Parse progression requirements
    if (currentSection === 'Progression Requirements' && line.startsWith('- [ ]')) {
      const reqContent = line.substring(5).trim()
      if (reqContent) {
        currentRequirement = { content: reqContent, children: [] }
        sectionData.progressionRequirements.push(currentRequirement)
      }
    }

    // Parse sub-requirements (indented)
    if (currentSection === 'Progression Requirements' && line.match(/^\s+- \[ \]/)) {
      const subReq = line.trim().substring(5).trim()
      if (subReq && currentRequirement) {
        currentRequirement.children.push({ content: subReq })
      }
    }
  }

  return sectionData
}

async function importAppliedGeography() {
  console.log('Starting Applied Geography import...\n')

  // Create Learning Path
  console.log('Creating learning path...')
  const { data: learningPath, error: pathError } = await supabase
    .from('learning_paths')
    .insert({
      name: 'Applied Geography',
      description: 'A practical curriculum for building geographic literacy. Focus on mastery—don't move to the next section until you meet the progression requirements.',
      duration: '~7 months',
      effort: '~1.5 hours/week',
      completion_standard: "You're done with this curriculum when geography has become a lens you automatically apply, not a subject you study. When you read news, you should instinctively think about terrain, neighbors, chokepoints, and resources—and notice when you're missing context.",
    })
    .select()
    .single()

  if (pathError) {
    console.error('Error creating learning path:', pathError)
    return
  }

  console.log(`Created learning path: ${learningPath.name}\n`)

  // Define units
  const units = [
    { name: 'Foundation', completeBy: '2026-04-02', sections: ['1A', '1B', '1C', '1D'] },
    { name: 'Strategic Geography', completeBy: '2026-06-08', sections: ['2A', '2B', '2C', '2D'] },
    { name: 'Depth', completeBy: '2026-08-10', sections: ['3A', '3B', '3C', '3D'] },
    { name: 'Integration & Curiosity', completeBy: '2026-09-07', sections: ['4A', '4B'] },
  ]

  // Create weekly rhythm
  console.log('Creating weekly rhythm...')
  const weeklyRhythm = [
    { day: 'Sunday', activity: 'New topic reading/videos', time: '45 min' },
    { day: 'Wednesday', activity: 'Seterra or map practice', time: '20 min' },
    { day: 'Friday', activity: 'Review + news connection', time: '25 min' },
  ]

  for (const [index, rhythm] of weeklyRhythm.entries()) {
    await supabase.from('weekly_rhythm').insert({
      learning_path_id: learningPath.id,
      ...rhythm,
      order_index: index,
    })
  }

  // Create phase resources
  console.log('Creating phase resources...')
  const phaseResources = [
    { phase: 'Foundation', resources: 'Seterra (free), blank maps to sketch on' },
    { phase: 'Strategic', resources: 'Prisoners of Geography (Tim Marshall), Peter Zeihan YouTube' },
    { phase: 'Depth', resources: 'CaspianReport (YouTube), The Accidental Superpower (Zeihan)' },
    { phase: 'Integration', resources: 'Google Earth terrain view, Atlas Obscura, your news diet' },
  ]

  for (const [index, resource] of phaseResources.entries()) {
    await supabase.from('phase_resources').insert({
      learning_path_id: learningPath.id,
      ...resource,
      order_index: index,
    })
  }

  // Section files mapping
  const sectionFiles: { [key: string]: string } = {
    '1A': '1A - US Geography.md',
    '1B': '1B - World Regions Mental Model.md',
    '1C': '1C - Core Countries - Europe & Americas.md',
    '1D': '1D - Core Countries - Middle East & Africa.md',
    '2A': '2A - Chokepoints & Trade Routes.md',
    '2B': '2B - Asia-Pacific.md',
    '2C': '2C - Russia, Eastern Europe & Central Asia.md',
    '2D': '2D - Resources & Economic Geography.md',
    '3A': '3A - Middle East Deep Dive.md',
    '3B': '3B - US Military Geography.md',
    '3C': '3C - Historical Context.md',
    '3D': '3D - Buffer & Consolidation.md',
    '4A': '4A - Travel Geography.md',
    '4B': '4B - News Integration Practice.md',
  }

  // Create units and sections
  for (const [unitIndex, unit] of units.entries()) {
    console.log(`\nCreating unit: ${unit.name}`)

    const { data: unitData, error: unitError } = await supabase
      .from('units')
      .insert({
        learning_path_id: learningPath.id,
        name: unit.name,
        order_index: unitIndex,
        complete_by: unit.completeBy,
      })
      .select()
      .single()

    if (unitError) {
      console.error(`Error creating unit ${unit.name}:`, unitError)
      continue
    }

    // Create sections for this unit
    for (const [sectionIndex, sectionCode] of unit.sections.entries()) {
      const fileName = sectionFiles[sectionCode]
      const filePath = path.join(OBSIDIAN_PATH, fileName)

      console.log(`  Importing section ${sectionCode}...`)

      const sectionData = parseMarkdownSection(filePath)

      if (!sectionData) {
        console.warn(`    Could not parse ${fileName}`)
        continue
      }

      // Parse deadline
      let deadline = null
      if (sectionData.deadline) {
        // Assuming format like "February 16, 2026" or "Feb 16"
        const deadlineStr = sectionData.deadline.replace(',', '')
        try {
          deadline = new Date(deadlineStr + ', 2026').toISOString().split('T')[0]
        } catch (e) {
          console.warn(`    Could not parse deadline: ${sectionData.deadline}`)
        }
      }

      const { data: section, error: sectionError } = await supabase
        .from('sections')
        .insert({
          unit_id: unitData.id,
          name: sectionData.name,
          code: sectionCode,
          deadline,
          order_index: sectionIndex,
        })
        .select()
        .single()

      if (sectionError) {
        console.error(`    Error creating section ${sectionCode}:`, sectionError)
        continue
      }

      // Insert topics
      for (const [topicIndex, topic] of sectionData.topics.entries()) {
        await supabase.from('topics').insert({
          section_id: section.id,
          content: topic,
          order_index: topicIndex,
        })
      }

      // Insert resources
      for (const [resourceIndex, resource] of sectionData.resources.entries()) {
        await supabase.from('section_resources').insert({
          section_id: section.id,
          name: resource.name,
          url: resource.url || null,
          description: resource.description || null,
          order_index: resourceIndex,
        })
      }

      // Insert progression requirements
      for (const [reqIndex, req] of sectionData.progressionRequirements.entries()) {
        const { data: requirement, error: reqError } = await supabase
          .from('progression_requirements')
          .insert({
            section_id: section.id,
            content: req.content,
            order_index: reqIndex,
            parent_id: null,
          })
          .select()
          .single()

        if (reqError) {
          console.error(`    Error creating requirement:`, reqError)
          continue
        }

        // Insert child requirements
        if (req.children && req.children.length > 0) {
          for (const [childIndex, child] of req.children.entries()) {
            await supabase.from('progression_requirements').insert({
              section_id: section.id,
              content: child.content,
              order_index: childIndex,
              parent_id: requirement.id,
            })
          }
        }
      }

      console.log(`    ✓ Imported ${sectionData.topics.length} topics, ${sectionData.progressionRequirements.length} requirements`)
    }
  }

  console.log('\n✓ Import complete!')
}

// Run import
importAppliedGeography().catch(console.error)
