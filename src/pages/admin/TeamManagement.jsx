import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Users, Shield, Plus, Mail } from 'lucide-react';

export const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', role: 'writer', uid: '' });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const teamData = [];
      querySnapshot.forEach((doc) => {
        teamData.push({ id: doc.id, ...doc.data() });
      });
      setTeam(teamData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching team", error);
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.uid) return;
    try {
      // In a real scenario, Firebase Admin SDK creates the auth user.
      // Here, we're just adding them to the 'users' collection mapped by a manually entered UID.
      // E.g., The super admin would tell the writer to register, then assign their UID here.
      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString()
      });
      setShowAddModal(false);
      setNewUser({ email: '', role: 'writer', uid: '' });
      fetchTeam();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  if (loading) return <div className="text-white">Loading team...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Team Member
        </button>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-900 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">UID</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {team.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No team members found. Add someone to the team!
                </td>
              </tr>
            ) : (
              team.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                      member.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{member.id}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-white transition-colors">Edit Role</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Team Member</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter their Firebase UID to assign them a role. They must first sign up.
            </p>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">User UID</label>
                <input 
                  type="text" 
                  required
                  value={newUser.uid}
                  onChange={(e) => setNewUser({...newUser, uid: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. qW3ErTy1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-medium hover:bg-emerald-400 transition-colors"
                >
                  Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
