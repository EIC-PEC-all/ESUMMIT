# Read the file
with open('lib/data.ts', 'r') as f:
    content = f.read()

# Find the second "export interface CampusVenue" after the SCHEDULE
parts = content.split('export const SCHEDULE = {')
if len(parts) >= 2:
    before_schedule = parts[0]
    after_schedule = 'export const SCHEDULE = {' + parts[1]
    
    # Find the second "export interface CampusVenue" in after_schedule
    second_interface_idx = after_schedule.find('\nexport interface CampusVenue {', 1000)
    if second_interface_idx == -1:
        import re
        match = re.search(r'\n\s*export interface CampusVenue\s*\{', after_schedule[1000:])
        if match:
            second_interface_idx = 1000 + match.start()
    
    if second_interface_idx != -1:
        # Find the end of the second CAMPUS_VENUES (look for "} as const")
        end_idx = after_schedule.find('} as const', second_interface_idx)
        if end_idx != -1:
            # Find the end of the statement
            end_idx = after_schedule.find('\n', end_idx + 10)
            if end_idx != -1:
                # Remove the duplicate section
                before_dup = after_schedule[:second_interface_idx]
                after_dup = after_schedule[end_idx+1:]
                after_schedule = before_dup + after_dup
        
        content = before_schedule + 'export const SCHEDULE = {' + after_schedule

with open('lib/data.ts', 'w') as f:
    f.write(content)

print("Done removing duplicate")