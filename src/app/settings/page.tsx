import AppLayout from '@/components/AppLayout';

export default function Settings() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your application preferences</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium">Settings Categories</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800">
                <nav className="flex flex-col">
                  <button className="px-4 py-3 text-left font-medium text-black dark:text-white bg-gray-100 dark:bg-gray-900 border-l-4 border-black dark:border-white">General</button>
                  <button className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">Appearance</button>
                  <button className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">Notifications</button>
                  <button className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">Security</button>
                  <button className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">Advanced</button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Settings content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium mb-4">General Settings</h3>
                
                <div className="space-y-6">
                  {/* Setting option */}
                  <div>
                    <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Application Name
                    </label>
                    <input
                      type="text"
                      id="appName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-black"
                      defaultValue="TechWar Desktop"
                    />
                  </div>
                  
                  {/* Toggle option */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-start on boot</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow application to start automatically when you turn on your computer</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-300 transition-transform"></div>
                    </div>
                  </div>
                  
                  {/* Toggle option - active */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme throughout the application</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-black cursor-pointer">
                      <div className="absolute left-7 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                    </div>
                  </div>
                  
                  {/* Dropdown option */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-black"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  
                  {/* Save button */}
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 