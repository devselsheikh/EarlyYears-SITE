import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Utensils, Download } from 'lucide-react';
import DaycareNav from '../../components/DaycareNav';
import DaycareFooter from '../../components/DaycareFooter';
import { useCMS } from '../../hooks/useCMS';

export default function DaycareCalendar() {
  const cms = useCMS();
  const legacyCalendarEvents = [
    { event: 'Staff & Newcomers Induction week', date: 'August 26th-28th, 2025', type: 'planning' },
    { event: 'Planning and setting up week', date: 'August 26th-28th, 2025', type: 'planning' },
    { event: 'Parents Orientation Day', date: 'August 31st, 2025', type: 'parent' },
    { event: 'First Day of Academic Year', date: 'September 1st, 2025', type: 'academic' },
    { event: 'Al Mawled El Nabawi - Daycare Closed', date: 'September 4th, 2025', type: 'holiday' },
    { event: 'Armed Forces Day - Daycare Closed', date: 'October 9th, 2025', type: 'holiday' },
    { event: 'Halloween Party', date: 'October 30th, 2025', type: 'event' },
    { event: 'Entry Reports Issued', date: 'November 6th, 2025', type: 'academic' },
    { event: 'Parent Teacher meetings', date: 'November 19th-20th, 2025', type: 'parent' },
    { event: 'Thanksgiving Day – Daycare Closed', date: 'November 27th, 2025', type: 'holiday' },
    { event: 'Tree trimming Day - Children Only event', date: 'November 30th, 2025', type: 'event' },
    { event: 'Santa\'s Visit (children event only)', date: 'December 18th, 2025', type: 'event' },
    { event: 'End of term one', date: 'December 18th, 2025', type: 'academic' },
    { event: 'Western Christmas – Daycare Closed', date: 'December 24th-25th, 2025', type: 'holiday' },
    { event: 'Teaching team breaks', date: 'December 21th - January 8th, 2026', type: 'break' },
    { event: 'New Years\' Day – Daycare Closed', date: 'January 1st, 2026', type: 'holiday' },
    { event: 'Eastern Christmas – Daycare Closed', date: 'January 7th, 2026', type: 'holiday' },
    { event: 'Epiphany Feast – Baptism Day – Daycare Closed', date: 'January 19th, 2026', type: 'holiday' },
    { event: '100 Days celebration', date: 'January 28th, 2026', type: 'event' },
    { event: 'Revolution Day – Daycare Closed', date: 'January 29th, 2026', type: 'holiday' },
    { event: 'Pancake Day Race - Parents Event', date: 'February 17th, 2026', type: 'event' },
    { event: 'Ramadan Starts – No Late School', date: 'February 18th, 2026', type: 'ramadan' },
    { event: 'Mothers day event', date: 'March 26, 2026', type: 'event' },
    { event: 'Eid El Fitr - Daycare Closed', date: 'March 19th-22nd, 2026', type: 'holiday' },
    { event: 'Easter Bonnet Parade and Egg Hunt', date: 'April 2nd, 2026', type: 'event' },
    { event: 'End of term 2', date: 'April 2nd, 2026', type: 'academic' },
    { event: 'Palm Sunday - Daycare closed', date: 'April 5th, 2026', type: 'holiday' },
    { event: 'Teaching team break', date: 'April 6th-30th, 2026', type: 'break' },
    { event: 'Holy Thursday - Daycare Closed', date: 'April 9th, 2026', type: 'holiday' },
    { event: 'Eastern and western Easter - Daycare Closed', date: 'April 12th, 2026', type: 'holiday' },
    { event: 'Sham el Nessim - Daycare Closed', date: 'April 13th, 2026', type: 'holiday' },
    { event: 'Eid El Adha - Daycare Closed', date: 'May 26th-28th, 2026', type: 'holiday' },
    { event: 'End of Year Reports issued', date: 'June 7th, 2026', type: 'academic' },
    { event: 'Parents Teacher Conferences', date: 'June 14th-17th, 2026', type: 'parent' },
    { event: 'Islamic New Year - Daycare closed', date: 'June 18th, 2026', type: 'holiday' },
    { event: 'End of year parties and Graduation', date: 'June 21st-25th, 2026', type: 'event' },
    { event: 'TERM 3 ENDS', date: 'June 25th, 2026', type: 'academic' },
    { event: 'Revolution Daycare Closed', date: 'June 30th, 2026', type: 'holiday' },
    { event: 'Summer Camp starts', date: 'July 5th, 2026', type: 'camp' },
    { event: 'National Holiday', date: 'July 23rd, 2026', type: 'holiday' },
    { event: 'Summer Camp Ends', date: 'August 13th, 2026', type: 'camp' },
    { event: 'Daycare Annual closure', date: 'August 16th-20th, 2026', type: 'closure' }
  ];

  const managedCalendarEvents = (cms.calendarEvents ?? [])
    .filter(event => event.active !== false)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
    .map(event => ({ event: event.title, date: event.date, type: event.type }));
  const calendarEvents = managedCalendarEvents.length > 0 ? managedCalendarEvents : legacyCalendarEvents;

  const legacyMenuWeek1 = [
    { day: 'Sunday', meal: 'Koshari & Salad' },
    { day: 'Monday', meal: 'Molokhia, Rice, Chicken, and Salad' },
    { day: 'Tuesday', meal: 'Chicken Shawarma, Rice, and yoghurt Salad' },
    { day: 'Wednesday', meal: 'Mesa2a3a with minced meat and rice, and salad' },
    { day: 'Thursday', meal: 'Pasta Bolognese and salad' }
  ];

  const legacyMenuWeek2 = [
    { day: 'Sunday', meal: 'Summer: Veggie Pasta / Winter: Lentil Soup with croutons' },
    { day: 'Monday', meal: 'Seasonal Veg in red sauce, minced meat, white rice and salad' },
    { day: 'Tuesday', meal: 'Yellow rice with chicken and white sauce, salad' },
    { day: 'Wednesday', meal: 'Molokhia, Rice, Chicken, and Salad' },
    { day: 'Thursday', meal: 'Margarita Pizza' }
  ];

  const managedMenus = (cms.meals?.menus ?? []).filter(menu => menu.season === 'winter');
  const toMenuRows = (week: 'week1' | 'week2') => managedMenus
    .find(menu => menu.week === week)?.days.map(day => ({ day: day.day, meal: `${day.lunch}${day.sides ? ` — ${day.sides}` : ''}` })) ?? [];
  const managedMenuWeek1 = toMenuRows('week1');
  const managedMenuWeek2 = toMenuRows('week2');
  const menuWeek1 = managedMenuWeek1.length > 0 ? managedMenuWeek1 : legacyMenuWeek1;
  const menuWeek2 = managedMenuWeek2.length > 0 ? managedMenuWeek2 : legacyMenuWeek2;

  const getEventColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-100 text-red-700 border-red-200';
      case 'event': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'academic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'term': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'parent': return 'bg-green-100 text-green-700 border-green-200';
      case 'ramadan': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'camp': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'break': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'closure': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DaycareNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">
              Academic Calendar & Menu
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stay informed about important dates, events, and what's on the menu throughout the 2025-26 academic year.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Academic Calendar */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
              <CalendarIcon className="w-4 h-4" />
              Academic Year 2025-26
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Academic Calendar
            </h2>
            <p className="text-xl text-gray-600">
              Important dates, holidays, and events throughout the year
            </p>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {[
              { label: 'National Holidays', type: 'holiday' },
              { label: 'Daycare Events', type: 'event' },
              { label: 'Academic Milestones', type: 'academic' },
              { label: 'Parent Events', type: 'parent' },
              { label: 'Ramadan Period', type: 'ramadan' },
              { label: 'Summer Camp', type: 'camp' }
            ].map((item, index) => (
              <div key={index} className={`px-4 py-2 rounded-full text-xs border ${getEventColor(item.type)}`}>
                {item.label}
              </div>
            ))}
          </motion.div>

          {/* Calendar Events */}
          <div className="space-y-3">
            {calendarEvents.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.02 }}
                className={`rounded-xl p-4 border-2 ${getEventColor(item.type)}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="md:w-48 flex-shrink-0 text-sm">{item.date}</div>
                  <div className="flex-1">{item.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lunch Menu */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
              <Utensils className="w-4 h-4" />
              Rotating Menu
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Daycare Lunch Menu
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Daily freshly cooked warm lunch with balanced nutrients
            </p>
            <p className="text-sm text-gray-500">
              Menu developed by Dr. Lobna Mourad, Assistant Professor of Biology and Human Nutrition
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Week 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl text-gray-900 mb-6 text-center">Week 1</h3>
              <div className="space-y-4">
                {menuWeek1.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="text-sm text-gray-500 mb-1">{item.day}</div>
                    <div className="text-gray-900">{item.meal}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Week 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl text-gray-900 mb-6 text-center">Week 2</h3>
              <div className="space-y-4">
                {menuWeek2.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="text-sm text-gray-500 mb-1">{item.day}</div>
                    <div className="text-gray-900">{item.meal}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-6 text-center"
          >
            <p className="text-gray-600 mb-4">
              All meals are freshly prepared daily using seasonal vegetables and fresh ingredients. We accommodate dietary requirements and allergies.
            </p>
            <div className="text-sm text-gray-500">
              The menu rotates on a 2-week cycle throughout the academic year
            </div>
          </motion.div>
        </div>
      </div>

      {/* Download Section */}
      <div className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl text-gray-900 mb-6">
              Need a Copy?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us to receive the full academic calendar and menu documents
            </p>
            <a
              href="mailto:info@theearlyyearscompany.com?subject=Request for Calendar and Menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-coral-500 text-white hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              Request Documents
            </a>
          </motion.div>
        </div>
      </div>

      </main>
      <DaycareFooter />
    </div>
  );
}
