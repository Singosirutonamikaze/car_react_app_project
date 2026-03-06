import React, { Component } from 'react';
import { LuDownload, LuRefreshCw } from 'react-icons/lu';
import ClientInfoCard from '../cards/ClientInfoCard';

class ClientsList extends Component {
    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleRefresh() {
        console.log('Actualisation de la liste des clients');
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    handleDownload() {
        console.log('Téléchargement des données clients');
        if (this.props.onDownload) {
            this.props.onDownload();
        }
    }

    render() {
    const { clients = [], onEditClient, onDeleteClient } = this.props;

        return (
            <div className="card bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800">
                        Liste des Clients ({clients.length})
                    </h4>
                    <div className="flex gap-2">
                        <button
                            onClick={this.handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                            <LuRefreshCw className="text-base" />
                            <span className="font-medium">Actualiser</span>
                        </button>
                        <button
                            onClick={this.handleDownload}
                            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        >
                            <LuDownload className="text-base" />
                            <span className="font-medium">Télécharger</span>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {clients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>Aucun client trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clients.map(client => (
                                <ClientInfoCard
                                    key={client._id}
                                    client={client}
                                    onEdit={() => onEditClient && onEditClient({ ...client, _id: client._id })}
                                    onDelete={() => onDeleteClient && onDeleteClient(client)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ClientsList;