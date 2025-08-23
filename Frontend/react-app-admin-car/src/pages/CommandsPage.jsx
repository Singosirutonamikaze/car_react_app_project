
import React, { Component } from 'react'
import DashboardLayout from '../components/layouts/DashboardLayout';

class CommandsPage extends Component {
  render() {
    const { loading } = this.props;

    if (loading) {
      return (
        <DashboardLayout activeMenu="Liste des Commandes">
          <div className="w-full h-full flex items-center justify-center bg-[#010B18]/70 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              <p className="text-slate-100/80 text-lg">Chargement des données...</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout activeMenu="Liste des Commandes">
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#010B18] via-[#010B18]/95 to-[#010B18]/90 p-6">

        </div>
      </DashboardLayout>
    )
  }

}

export default CommandsPage;
